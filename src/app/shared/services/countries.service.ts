import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { IBasicCountryInfo, ICovidGeneralData } from 'src/app/models';
import { chartsDataMock } from './countryService.mock';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'c31z' }),
    mode: 'no-cors',
  };

  constructor(
    private http: HttpClient,
  ) { }

  public getCountriesBorders(): Observable<any> {
    return this.http.get('./assets/data/world.geojson', this.httpOptions);
  }

  public getCountriesData(): Observable<IBasicCountryInfo[]> {
    return this.http.get('http://localhost:3000/countries', this.httpOptions) as Observable<IBasicCountryInfo[]>;
  }

  public getCovidGeneralData(): Observable<ICovidGeneralData> {
    return this.http.get('http://localhost:3000/covid/general', this.httpOptions) as Observable<ICovidGeneralData>;
  }

  public getChartsCountryData(countryId: string = 'countryId'): Observable<any> {
    // return of(chartsDataMock);
    return this.http.get(`http://localhost:3000/overview?country=${countryId}`);
  }
}
