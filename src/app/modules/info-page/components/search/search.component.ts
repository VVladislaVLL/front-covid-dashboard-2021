import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IBasicCountryInfo } from '../../../../models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  @Input() countries: IBasicCountryInfo[] = [];
  public seachValue: string = '';
  public countriesToDisplay: IBasicCountryInfo[] = [];

  public ngOnInit(): void {

    // TODO: delete
    const { indexes, count } = this.countries.reduce<{ indexes: number[]; count: number }>((res, country, index) => {
      if (Object.keys(country).length === 0) {
        res.indexes.push(index);
        res.count += 1;
      }
      return res;
    }, { indexes: [], count: 0 });
    console.log('count = ', count, 'indexes = ', indexes);


    this.countriesToDisplay = this.updateCountriesToDisplay();
  }

  public onSearch(searchValue: string): void {
    // this.countriesToDisplay = this.updateCountriesToDisplay();
    this.seachValue = searchValue;
    this.countriesToDisplay = this.countries.filter((country) => Object.keys(country).length > 0 && (country?.name)?.toLocaleLowerCase().includes(searchValue));
    console.log(this.countriesToDisplay);
    // this.countriesToDisplay = this.updateCountriesToDisplay(this.getSearchCallback(searchValue));
  }
  //
  private getSearchCallback(searchValue: string): (country: IBasicCountryInfo) => boolean {
    return (country: IBasicCountryInfo) => {
      return !!country.name.indexOf(searchValue);
    };
  }

  private updateCountriesToDisplay(filterCallback?: (country: IBasicCountryInfo) => boolean): IBasicCountryInfo[] {
    if (filterCallback != null) {
      console.log(filterCallback);
      return this.countries.filter((country) => filterCallback(country));
    }
    return this.countries.filter(country => Object.keys(country).length > 0);
  }

}
