import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef, OnChanges, SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { take } from 'rxjs/operators';

import { CountriesService } from 'src/app/shared/services/countries.service';
import { IBasicCountryInfo } from 'src/app/models';
import { ColorsScaler } from './map.models';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() covidData: IBasicCountryInfo[] = [];
  @Output() selectCountry = new EventEmitter<string>();
  private map: L.Map;
  private countriesBorders: any;
  private countriesLayer: any;
  public isLoading: boolean = false;

  private readonly MAP_CENTER: L.LatLngExpression = [48.85661, 2.3515];
  private readonly SOUTH_WEST_BOUND =  L.latLng(-81, -175);
  private readonly NORTH_EAST_BOUND =  L.latLng(84.5, 190);
  private readonly BOUNDS = L.latLngBounds(this.SOUTH_WEST_BOUND, this.NORTH_EAST_BOUND);
  private readonly tileTemplate = 'https://tile.jawg.io/jawg-dark/{z}/{x}/{y}.png?access-token=jjvigHLRVr9EwAJlNgFICHMHVo0h8ugKYleAdYjsRdFLVOWrxE7mxa8XEr96lHF0';
  private readonly MIN_ZOOM = 2;
  private readonly MAX_ZOOM = 7;

  private readonly HIGHLIGHT_COUNTRY_STYLES = {
    weight: 1.5,
    color: 'white',
    opacity: 1,
    dashArray: '3',
  };
  private colorScale: ColorsScaler;

  constructor(
    private countriesService: CountriesService,
    private changeDetection: ChangeDetectorRef,
  ) {}


  public ngOnChanges(changes: SimpleChanges) {
    if (changes.covidData && this.covidData.length > 0) {
      this.countriesService.getCountriesBorders().pipe(take(1)).subscribe((borders: any) => {
        this.countriesBorders = borders;
        this.initCountriesBorders();
        this.changeDetection.markForCheck();
      });
    }
  }

  public ngOnInit(): void {
    this.isLoading = true;
  }

  public ngAfterViewInit(): void {
    this.initMap();
  }

  private initCountriesBorders(): void {
    this.countriesLayer = L.geoJSON(this.countriesBorders, {
      style: (feature) => this.getStyles(feature),
      onEachFeature: (feature: any, layer: L.Layer) => this.onCountryEvent(feature, layer),
    });
    this.map.addLayer(this.countriesLayer);
    this.countriesLayer.bringToBack();
    this.isLoading = false;
  }

  private getStyles(feature: any) {
    const countryCovidInfo = this.getCovidInfoByISO2CodeFromGeoJson(feature.properties.iso_a2);
    if (countryCovidInfo !== null) {
      return ({
        weight: 0.5,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fill: true,
        // fillColor: this.colorScale('' + countryCovidInfo.infected),
        // fillColor: this.colorScale('' + countryCovidInfo.infected),
        // fillOpacity: countryCovidInfo.infected > 0 ? 0.5 : 0,
        fillOpacity: 0,
      });
    }
    return ({
      weight: 0.5,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fill: true,
      fillColor: 'white',
      fillOpacity: 0,
    });
  }

  private getCovidInfoByISO2CodeFromGeoJson(iso2: string): IBasicCountryInfo | null {
    return this.covidData.find((country: IBasicCountryInfo) => country.iso2 === iso2) || null;
  }

  private initMap(): void {
    this.map = L.map('map').setView(this.MAP_CENTER, this.MIN_ZOOM);
    L.tileLayer(this.tileTemplate, {
      minZoom: this.MIN_ZOOM,
      maxZoom: this.MAX_ZOOM,
    }).addTo(this.map);
    this.map.setMaxBounds(this.BOUNDS);
    this.map.on('drag', () => {
      this.map.panInsideBounds(this.BOUNDS, { animate: false });
    });
  }

  private onCountryEvent(feature: any, layer: L.Layer): void {
    const currentCounty = this.getCountryByISO2(feature.properties.iso_a2);
    console.log(currentCounty);
    const popupContent2 = `
      <img src="${currentCounty?.flag}"/>
      <h3>${currentCounty?.name}</h3>
    `;
    layer.bindPopup(popupContent2);
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        this.highlightCountry(e);
        console.log(feature.properties);
        layer.openPopup();
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        this.resetHighlightCountry(e);
        layer.closePopup();
      },
      click: (e: L.LeafletMouseEvent) => this.zoomToCountry(e),
      mousemove: (e: L.LeafletMouseEvent) => {
        layer.getPopup()?.setLatLng(e.latlng);
      },
    });
  }

  private highlightCountry(e: L.LayerEvent): void {
    const layer = e.target;
    layer.setStyle({ ...this.HIGHLIGHT_COUNTRY_STYLES });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  private resetHighlightCountry(e: L.LayerEvent): void {
    this.countriesLayer.resetStyle(e.target);
  }

  private zoomToCountry(e: L.LayerEvent): void {
    this.map.fitBounds(e.target.getBounds());
    // this.map.flyToBounds(e.target.getBounds(), { animate: true });
    this.selectCountry.emit(e.sourceTarget.feature.properties.iso_a2);
  }

  private getCountryByISO2(iso2: string):IBasicCountryInfo | null {
    console.log('getCountryByISO2', iso2);
    return this.covidData.find((country: IBasicCountryInfo) => country.iso2 === iso2) || null;
  }
}
