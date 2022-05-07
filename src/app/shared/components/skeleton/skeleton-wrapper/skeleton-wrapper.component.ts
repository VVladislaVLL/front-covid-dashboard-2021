import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-wrapper',
  templateUrl: './skeleton-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonWrapperComponent {
  @Input() isLoading: boolean;
}
