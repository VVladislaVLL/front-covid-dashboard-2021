import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ICovidGeneralData, InfoField } from 'src/app/models';
import { RED_COLORS, BLUE_COLORS, GREEN_COLORS } from 'src/app/modules/info-page/components/map/map/map.constants';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInfoComponent {
  @Input() data: ICovidGeneralData;
  @Input() selectedValue: InfoField;

  public readonly infoFields: typeof InfoField = InfoField;

  public getSelectedColor(field: InfoField): string {
    if (this.selectedValue === field) {
      switch (this.selectedValue) {
        case this.infoFields.Infected:
          return RED_COLORS[RED_COLORS.length - 12];
        case this.infoFields.Dead:
          return RED_COLORS[RED_COLORS.length - 12];
        case this.infoFields.Recovered:
          return GREEN_COLORS[GREEN_COLORS.length - 12];
        case this.infoFields.Vaccinated:
          return BLUE_COLORS[BLUE_COLORS.length - 12];
        default:
          return RED_COLORS[RED_COLORS.length - 12];
      }
    } else {
      return '';
    }
  }
}
