import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { IBasicCountryInfo } from 'src/app/models';

@Component({
  selector: 'app-country-row',
  templateUrl: './country-row.component.html',
  styleUrls: ['./country-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryRowComponent {
  @Input() country: IBasicCountryInfo;
  @Input() rowNumber: number;
  @Input() highlight: string = '';
}
