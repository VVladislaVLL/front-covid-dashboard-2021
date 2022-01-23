import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { take } from 'rxjs/operators';
import { CountriesService } from '../services/countries.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
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
    weight: 1,
    color: 'white',
    opacity: 1,
    dashArray: '3',
    fillColor: '#FFF',
    fillOpacity: 0.1,
  };
  private readonly BORDERS_COUNTRY_STYLES = {
    weight: 0.5,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fill: true,
    fillOpacity: 0,
  };

  constructor(
    private countriesService: CountriesService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
  }

  private initCountriesBorders(): void {
    this.countriesLayer = L.geoJSON(this.countriesBorders, {
      style: () => this.BORDERS_COUNTRY_STYLES,
      onEachFeature: (feature: any, layer: L.Layer) => this.onCountryEvent(feature, layer),
    });
    this.map.addLayer(this.countriesLayer);
    this.countriesLayer.bringToBack();
    this.isLoading = false;
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.countriesService.getCountriesBorders().pipe(take(1)).subscribe((borders) => {
      this.countriesBorders = borders;
      this.initCountriesBorders();
    });
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

  private onCountryEvent(_: any, layer: L.Layer): void {
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => this.highlightCountry(e),
      mouseout: (e: L.LeafletMouseEvent) => this.resetHighlightCountry(e),
      click: (e: L.LeafletMouseEvent) => this.zoomToCountry(e),
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
  }
}
