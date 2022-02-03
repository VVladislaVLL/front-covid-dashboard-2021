import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ICovidGeneralData } from '../../../../models';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInfoComponent {
  @Input() data: ICovidGeneralData;
}
