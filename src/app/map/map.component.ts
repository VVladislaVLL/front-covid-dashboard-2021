import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import {CountriesService} from "../services/countries.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  // @ts-ignore
  private map: L.Map;
  // @ts-ignore
  // private mapControl = L.control();
  // @ts-ignore
  // private countriesBorders: L.GeoJSON;
  private countriesBorders: any;
  public isLoading: boolean = false;
  // @ts-ignore
  // private legend = L.control({ position: 'bottomleft' });


  private readonly SOUTH_WEST_BOUND =  L.latLng(-81, -175);
  private readonly NORTH_EAST_BOUND =  L.latLng(84.5, 190);
  private readonly BOUNDS = L.latLngBounds(this.SOUTH_WEST_BOUND, this.NORTH_EAST_BOUND);
  // private readonly STATUS_KEYS = ['NewConfirmed', 'TotalConfirmed', 'NewDeaths', 'TotalDeaths', 'NewRecovered', 'TotalRecovered'];
  private readonly MIN_ZOOM = 2;
  private readonly MAX_ZOOM = 7;
  private readonly HIGHLIGHT_COUNTRY_STYLES = {
    weight: 0.3,
    color: '#666',
    opacity: 1,
    dashArray: '',
    fillColor: '#FFF',
    fillOpacity: 0.1,
  }
  private readonly BORDERS_COUNTRY_STYLES = {
    weight: 0.1,
    opacity: 0,
    color: 'white',
    dashArray: '1',
    fill: true,
    fillOpacity: 0,
  }

  constructor(
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.isLoading = true;
    this.countriesService.getCountriesBorders().subscribe((borders) => {
      this.countriesBorders = L.geoJSON(borders, {
        style: () => this.BORDERS_COUNTRY_STYLES,
        onEachFeature: this.onCountryEvent,
      }).addTo(this.map);
      this.isLoading = false;
    });
  }

  ngAfterViewInit(): void {
    this.isLoading = true;
  }

  private initMap(): void {
    this.map = L.map('map').setView([48.85661, 2.3515], this.MIN_ZOOM);
    L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}.png?access-token=jjvigHLRVr9EwAJlNgFICHMHVo0h8ugKYleAdYjsRdFLVOWrxE7mxa8XEr96lHF0', {
      minZoom: this.MIN_ZOOM,
      maxZoom: this.MAX_ZOOM,
    }).addTo(this.map);
    this.map.setMaxBounds(this.BOUNDS);
    this.map.on('drag', () => {
      this.map.panInsideBounds(this.BOUNDS, { animate: false });
    });
  }

  private onCountryEvent(_: any, layer: L.Layer) {
    layer.on({
      mouseover: this.highlightCountry,
      mouseout: this.resetHighlightCountry,
      click: this.zoomToCountry,
    });
  }

  private highlightCountry(e: L.LayerEvent): void {
    const layer = e.target;
    layer.setStyle({...this.HIGHLIGHT_COUNTRY_STYLES});
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
    // this.mapControl.update(layer.feature.properties);
  }

  private resetHighlightCountry(e: L.LayerEvent): void {
    this.countriesBorders.resetStyle(e.target);
    // this.mapControl.update();
  }

  private zoomToCountry(e: L.LayerEvent): void {
    this.map.fitBounds(e.target.getBounds());
  }
}
