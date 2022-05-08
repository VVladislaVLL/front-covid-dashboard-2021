import { Directive, ElementRef, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { BrowserDetectInfo } from 'browser-detect/dist/types/browser-detect.interface';
import browser from 'browser-detect';
import { BaseTooltip } from './base-tooltip';
import { PortalPlacement, PortalThemes } from 'src/app/shared/enums';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective extends BaseTooltip {
  @Input('appTooltip') public displayValue: TemplateRef<Element> | string;
  @Input('appTooltipPlacement') public placement: PortalPlacement = PortalPlacement.TopCenter;
  @Input('appTooltipTheme') public theme: PortalThemes = PortalThemes.Dark;

  private browserDetectInfo: BrowserDetectInfo;

  constructor(
    protected elementRef: ElementRef,
    protected overlay: Overlay,
    protected viewContainerRef: ViewContainerRef,
  ) {
    super(elementRef, overlay, viewContainerRef);
    this.browserDetectInfo = browser();
  }

  @HostListener('window:resize')
  public onResize(): void {
    this.browserDetectInfo = browser();
  }

  @HostListener('pointerleave')
  @HostListener('blur')
  public onHide(): void {
    this.hide();
  }

  @HostListener('pointerenter')
  @HostListener('focus')
  @HostListener('input')
  public onShow(): void {
    if (!this.browserDetectInfo.mobile && !this.isOpen) {
      this.show();
    }
  }

  @HostListener('window:click', ['$event'])
  public onClick(event: MouseEvent): void {
    const isClickedOnElement: boolean = this.elementRef.nativeElement.contains(event.target);
    if (!this.isOpen && isClickedOnElement) {
      if (this.browserDetectInfo.mobile) {
        this.show();
      }
    } else {
      this.hide();
    }
  }
}
