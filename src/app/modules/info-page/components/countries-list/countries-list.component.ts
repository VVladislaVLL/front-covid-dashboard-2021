import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { IBasicCountryInfo, InfoField } from 'src/app/models';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountriesListComponent {
  @Input() countriesToDisplay: IBasicCountryInfo[] = [];
  @Input() searchValue: string;
  @Input() selectedField: { value: InfoField; viewValue: string; selected: boolean };

  @Output() selectCountry = new EventEmitter<string>();
}
