import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ComponentFactoryResolver, ComponentRef,
  EventEmitter, Inject, Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges, TemplateRef, ViewChild, ViewContainerRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as L from 'leaflet';
import { take } from 'rxjs/operators';

import { CountriesService } from 'src/app/shared/services/countries.service';
import { IBasicCountryInfo, InfoField } from 'src/app/models';
import { getColor } from './map.helpers';
import { GEO_JSON_ISO_A2, GEO_JSON_NAME, TITLE_TEMPLATE } from './map.constants';
import { CountryTooltipComponent } from 'src/app/modules/info-page/components/map/country-tooltip/country-tooltip.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() covidData: IBasicCountryInfo[] = [];
  @Input() selectedOption: InfoField;
  @ViewChild('countryTooltip') template: TemplateRef<any>;

  @Output() selectCountry = new EventEmitter<string>();
  @Output() hidden = new EventEmitter();
  @Output() shown = new EventEmitter();


  private tooltip: ComponentRef<CountryTooltipComponent>;

  private map: L.Map;
  private countriesBorders: any;
  private countriesLayer: any;
  public isLoading: boolean = false;
  public hoveredCountry = null;

  private readonly MAP_CENTER: L.LatLngExpression = [48.85661, 2.3515];
  private readonly SOUTH_WEST_BOUND =  L.latLng(-81, -175);
  private readonly NORTH_EAST_BOUND =  L.latLng(84.5, 190);
  private readonly BOUNDS = L.latLngBounds(this.SOUTH_WEST_BOUND, this.NORTH_EAST_BOUND);
  private readonly tileTemplate = TITLE_TEMPLATE;
  private readonly MIN_ZOOM = 2;
  private readonly MAX_ZOOM = 7;
  private readonly HIGHLIGHT_COUNTRY_STYLES = {
    weight: 1.5,
    color: 'white',
    opacity: 1,
    dashArray: '3',
  };

  constructor(
    private countriesService: CountriesService,
    private changeDetection: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document,
  ) {}


  public ngOnChanges(changes: SimpleChanges) {
    if (changes.covidData && this.covidData.length > 0) {
      this.countriesService.getCountriesBorders().pipe(take(1)).subscribe((borders: any) => {
        this.countriesBorders = borders;
        this.initCountriesBorders();
        this.changeDetection.markForCheck();
      });
    }

    if (changes.selectedOption && !changes.selectedOption.firstChange) {
      this.reinitCountriesStyles();
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
    const countryCovidInfo = this.getCovidInfoByISO2CodeFromGeoJson(feature.properties[GEO_JSON_ISO_A2]);
    if (countryCovidInfo !== null) {
      return ({
        weight: 0.5,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fill: true,
        ...MapComponent.getCountyColor(countryCovidInfo, this.selectedOption),
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
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        this.highlightCountry(e);
        this.showCountryTooltip(this.getCountryByISO2(feature.properties[GEO_JSON_ISO_A2], feature), e);
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        this.resetHighlightCountry(e);
        this.destroyTooltip();
      },
      click: (e: L.LeafletMouseEvent) => this.zoomToCountry(e),
      // mousemove: (e: L.LeafletMouseEvent) => {
      // layer.getPopup()?.setLatLng(e.latlng);
      // },
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
    this.selectCountry.emit(e.sourceTarget.feature.properties[GEO_JSON_ISO_A2]);
  }

  private getCountryByISO2(iso2: string, geoJSONCountry?: any):IBasicCountryInfo | null {
    const currentCountry = this.covidData.find((country: IBasicCountryInfo) => country.iso2 === iso2);
    return currentCountry == null
      ? this.covidData.find((country) => (country.name === geoJSONCountry.properties[GEO_JSON_NAME])) || null
      : currentCountry;
  }

  private static getCountyColor(countyInfo: IBasicCountryInfo, field: InfoField = InfoField.Infected): { fillColor: string; fillOpacity: number } {
    const coefficientInRelationToThePopulation = countyInfo[field] / countyInfo.population;
    return {
      fillColor: getColor(coefficientInRelationToThePopulation, field),
      fillOpacity: isNaN(coefficientInRelationToThePopulation) || coefficientInRelationToThePopulation === 0 ? 0 : 0.5,
    };
  }

  private reinitCountriesStyles(): void {
    this.countriesLayer.resetStyle();
    this.countriesLayer.setStyle((feature: any) => this.getStyles(feature));
  }

  private createCountryTooltip(): void {
    const factory = this.resolver.resolveComponentFactory(CountryTooltipComponent);
    const view = this.viewContainerRef.createEmbeddedView(this.template);
    const nodes = [view.rootNodes];
    this.tooltip = this.viewContainerRef.createComponent(
      factory,
      undefined,
      this.injector,
      nodes,
    );
    this.tooltip.location.nativeElement.style.top = '-1000px';
    this.tooltip.location.nativeElement.style.left = '-1000px';
    this.tooltip.location.nativeElement.style.visibility = 'hidden';
    this.document.body.appendChild(this.tooltip.location.nativeElement);
  }

  public hideCountryTooltip(): void {
    this.destroyTooltip();
  }

  private destroyTooltip(): void {
    this.viewContainerRef.clear();
  }

  private showCountryTooltip(country: IBasicCountryInfo | null, event: L.LeafletMouseEvent): void {
    if (country) {
      this.createCountryTooltip();
      const tooltipComponent = this.tooltip.instance;
      tooltipComponent.countryInfo = country;
      this.tooltip.location.nativeElement.style.top = event.originalEvent.screenY + 'px';
      this.tooltip.location.nativeElement.style.left = event.originalEvent.screenX + 'px';
      this.tooltip.location.nativeElement.style.visibility = '';
      this.tooltip.changeDetectorRef.detectChanges();
    }
  }
}
