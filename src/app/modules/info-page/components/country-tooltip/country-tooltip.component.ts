import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { IBasicCountryInfo } from 'src/app/models';

@Component({
  selector: 'app-country-tooltip',
  templateUrl: './country-tooltip.component.html',
  styleUrls: ['./country-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryTooltipComponent {
  @Input() countryInfo: IBasicCountryInfo;
}
