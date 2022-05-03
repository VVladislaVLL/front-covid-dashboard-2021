import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

import { InfoField } from 'src/app/models';
import { getColorPalette } from 'src/app/modules/info-page/components/map/map.helpers';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendComponent implements OnChanges {
  @Input() selectedFieldValue: InfoField;


  public displayedLegendColors: string[];
  public displayedData: { color: string; value: string }[];

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedFieldValue) {
      this.displayedLegendColors = getColorPalette(this.selectedFieldValue);
      this.displayedData = this.displayedLegendColors.reduce<{ color: string; value: string }[]>((displayedData, color, index) => {
        if (index === 0) {
          displayedData.push({
            color: color,
            value: '0% - 1%',
          });
          return displayedData;
        }

        if (index === 1) {
          displayedData.push({
            color: color,
            value: '1% - 5%',
          });
          return displayedData;
        }

        displayedData.push({
          color: color,
          value: `${(index - 1) * 5}% - ${index * 5}%`,
        });
        return displayedData;
      }, []);
    }
  }
}
