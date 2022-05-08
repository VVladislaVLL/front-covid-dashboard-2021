import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { IBasicCountryInfo, InfoField } from 'src/app/models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnChanges {
  @Input() countries: IBasicCountryInfo[] = [];
  @Input() selectedOption: { value: InfoField; viewValue: string; selected: boolean };

  @Output() selectCountry = new EventEmitter<string>();


  public searchValue: string = '';
  public countriesToDisplay: IBasicCountryInfo[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedOption && changes.selectedOption.currentValue) {
      this.countriesToDisplay = this.updateCountriesToDisplay();
    }
  }

  public onSearch(searchValue: string): void {
    // this.countriesToDisplay = this.updateCountriesToDisplay();
    this.searchValue = searchValue;
    this.countriesToDisplay = this.updateCountriesToDisplay(
      (country: IBasicCountryInfo) => Object.keys(country).length > 0 && (country?.name)?.toLocaleLowerCase().includes(searchValue),
    );
    // this.countriesToDisplay = this.updateCountriesToDisplay(this.getSearchCallback(searchValue));
  }
  //
  private getSearchCallback(searchValue: string): (country: IBasicCountryInfo) => boolean {
    return (country: IBasicCountryInfo) => {
      return !!country.name.indexOf(searchValue);
    };
  }

  private updateCountriesToDisplay(filterCallback?: (country: IBasicCountryInfo) => boolean): IBasicCountryInfo[] {
    if (!filterCallback) {
      filterCallback = (country: IBasicCountryInfo) => Object.keys(country).length > 0;
    }

    return this.sortCountriesBySelectedOption(this.countries.filter(filterCallback));
  }

  private sortCountriesBySelectedOption(countries: IBasicCountryInfo[]): IBasicCountryInfo[] {
    const notVisibleCountries: IBasicCountryInfo[] = [];
    const visibleCountries: IBasicCountryInfo[] = [];

    countries.forEach((country) => {
      if (country.isVisible) {
        visibleCountries.push(country);
      } else {
        notVisibleCountries.push(country);
      }
    });

    return [
      ...visibleCountries.sort((a, b) => (b[this.selectedOption.value] || 0) - (a[this.selectedOption.value] || 0)),
      ...notVisibleCountries.sort((a, b) => a.name.localeCompare(b.name)),
    ];
  }
}
