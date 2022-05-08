import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { PortalPlacement, PortalThemes } from '../../enums';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PortalComponent {
  @Input() public view: TemplateRef<Element>;
  @Input() public text: string;
  @Input() public placement: PortalPlacement;
  @Input() public theme: PortalThemes;
  @Input() public closingFn: () => void;
}
