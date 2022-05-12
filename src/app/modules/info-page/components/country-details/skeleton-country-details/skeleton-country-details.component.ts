import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton-country-details',
  templateUrl: './skeleton-country-details.component.html',
  styleUrls: ['./skeleton-country-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonCountryDetailsComponent {
  public getRandomHeight(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
