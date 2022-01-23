import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    // return this.http.get('https://github.com/VVladislaVLL/covid-dashboard/blob/ae1c025811a6207662dc012594d7b75aa12ea941/covid-dashboard/src/js/countries.json', this.httpOptions)
    return this.http.get('./assets/data/custom.geo.json', this.httpOptions);
  }

  public getCountriesInfo(): Observable<any> {
    return this.http.get('https://countriesnow.space/api/v0.1/countries/population', this.httpOptions);
  }

  public getCountry(country: string): Observable<any> {
    return this.http.post('https://countriesnow.space/api/v0.1/countries/population', { ...this.httpOptions, country: country.toLocaleLowerCase() });
  }

  public getCountryUnicodeFlag(country: string): Observable<any> {
    return this.http.post('https://countriesnow.space/api/v0.1/countries/flag/unicode', { ...this.httpOptions, country: country.toLocaleLowerCase() });
  }
}
