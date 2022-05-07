import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-circle',
  templateUrl: './skeleton-circle.component.html',
  styleUrls: ['./skeleton-circle.component.scss', '../base-skeleton-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonCircleComponent {
  @Input() diameterPx = 16;
}
