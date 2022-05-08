import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-case-block',
  templateUrl: './case-block.component.html',
  styleUrls: ['./case-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseBlockComponent {
  @Input() value: string | number | null;
  @Input() name: string = 'total';
  @Input() textColor: string = '';
  @Input() isReversed?: boolean = false;
}
