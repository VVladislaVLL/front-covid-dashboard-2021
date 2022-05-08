import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IBasicCountryInfo, ICovidGeneralData } from 'src/app/models';

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

  public getCountryCovidHistoryByISO2A(iso2: string): Observable<any> {
    return this.http.get(`http://localhost:3000/covid/history?country=${iso2}`);
  }

  public getCountryCovidOverviewByISO2A(iso2: string): Observable<any> {
    return this.http.get(`http://localhost:3000/covid/overview?country=${iso2}`);
  }

  public getGeneralCountryInfoByISO2(iso2: string): Observable<any> {
    return this.http.get(`http://localhost:3000/countries/${iso2}`);
  }
}
