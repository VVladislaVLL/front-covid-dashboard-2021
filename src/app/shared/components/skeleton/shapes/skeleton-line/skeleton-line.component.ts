import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-line',
  templateUrl: './skeleton-line.component.html',
  styleUrls: ['./skeleton-line.component.scss', '../base-skeleton-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonLineComponent {
  @Input() widthPx: number;
  @Input() range: [number, number];
  @Input() heightPx = 16;
  @Input() borderRadiusPx: number = 8;
  @Input() marginsPx: { left: number; top: number; right: number; bottom: number };

  get width(): number {
    return !this.widthPx && this.range ? this.getRandomWidthFromRangeInRem() : this.widthPx;
  }

  public getRandomWidthFromRangeInRem(): number {
    return Math.floor(Math.random() * (this.range[1] - this.range[0])) + this.range[0];
  }
}
