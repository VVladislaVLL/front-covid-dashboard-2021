import { ComponentRef, Directive, ElementRef, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import {
  CloseScrollStrategy,
  ComponentType,
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  FlexibleConnectedPositionStrategyOrigin,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { PortalComponent } from '../../components/portal/portal.component';
import { PortalPlacement, PortalThemes } from '../../enums';
import { PORTAL_POSITIONS_MAP } from '../../constants';

const TOOLTIP_MAX_WIDTH: number = 330;
const VERTICAL_INDENT_WITHOUT_ARROW: number = 4;
const BASE_OVERLAY_CLASS: string = 'overlay';

@Directive()
export class BaseTooltip implements OnInit, OnDestroy {
  public displayValue: TemplateRef<Element> | string;
  public placement: PortalPlacement;
  public theme: PortalThemes;
  public config: OverlayConfig;
  public overlayRef: OverlayRef;

  protected ComponentToAttach: ComponentType<PortalComponent> = PortalComponent;
  protected subscriptions: Subscription[] = [];
  protected isOpen: boolean = false;
  protected connectionElement: FlexibleConnectedPositionStrategyOrigin;
  protected overlayPosition: FlexibleConnectedPositionStrategy;
  protected positions: ConnectionPositionPair[];
  protected templateToAttach: TemplateRef<Element>;
  protected componentAttachment: ComponentRef<PortalComponent>;
  protected readonly baseOverlayClass: string = BASE_OVERLAY_CLASS;

  private positionChangeSubs: Subscription;
  private readonly viewportMargin: number = 4;

  constructor(protected elementRef: ElementRef, protected overlay: Overlay, protected viewContainerRef: ViewContainerRef) {}

  private get portalCmp(): PortalComponent {
    return this.componentAttachment.instance;
  }

  public ngOnInit(): void {
    this.initConfig();
    this.initPositions();
  }

  public ngOnDestroy(): void {
    if (this.isOpen) {
      this.hide();
    }

    this.positionChangeSubs?.unsubscribe();
    this.subscriptions.forEach((s: Subscription) => {
      if (s && s.unsubscribe) {
        s.unsubscribe();
      }
    });
  }

  protected show(): void {
    this.isOpen = true;
    this.showOverlay();

    if (typeof this.displayValue === 'string') {
      this.portalCmp.text = this.displayValue as string;
    } else {
      this.portalCmp.view = this.displayValue as TemplateRef<Element>;
    }
    this.portalCmp.theme = this.theme;
    this.portalCmp.placement = this.placement;
    this.portalCmp.closingFn = this.hide.bind(this);
  }

  protected hide(): void {
    this.isOpen = false;
    this.componentAttachment?.destroy();
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
  }

  private showOverlay(): void {
    let portal: ComponentPortal<PortalComponent> | TemplatePortal;
    if (this.ComponentToAttach) {
      portal = new ComponentPortal(this.ComponentToAttach, this.viewContainerRef);
    } else {
      portal = new TemplatePortal(this.templateToAttach, this.viewContainerRef);
    }

    this.createOverlay(portal);
  }

  private createOverlay(portal: ComponentPortal<PortalComponent> | TemplatePortal): void {
    const panelClasses: string[] = this.getPanelClasses();
    const isCloseStrategy: boolean = this.config?.scrollStrategy instanceof CloseScrollStrategy;
    this.overlayPosition = this.getOverlayPosition(this.positions);

    this.overlayRef = this.overlay.create({
      width: this.config?.width,
      height: this.config?.height,
      maxWidth: this.config?.maxWidth,
      maxHeight: this.config?.maxHeight,
      minWidth: this.config?.minWidth,
      minHeight: this.config?.minHeight,
      scrollStrategy: isCloseStrategy ? this.overlay.scrollStrategies.close() : this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.overlayPosition,
      panelClass: panelClasses,
    });

    if (this.ComponentToAttach) {
      this.componentAttachment = this.overlayRef.attach(portal);
    } else {
      this.overlayRef.attach(portal);
    }
  }

  private getPanelClasses(): string[] {
    if (this.config?.panelClass) {
      return Array.isArray(this.config.panelClass)
        ? [...this.config.panelClass, this.baseOverlayClass]
        : [this.config.panelClass, this.baseOverlayClass];
    } else {
      return [this.baseOverlayClass];
    }
  }

  protected getOverlayPosition(positions: ConnectionPositionPair[]): FlexibleConnectedPositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.connectionElement || this.elementRef)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withViewportMargin(this.viewportMargin);
  }

  public updatePosition(): void {
    this.overlayPosition = this.getOverlayPosition(this.positions);
    this.overlayRef.updatePositionStrategy(this.overlayPosition);
  }

  private initPositions(): void {
    this.positions = PORTAL_POSITIONS_MAP.get(this.placement) as ConnectionPositionPair[];

    this.positions = this.positions.map((value: ConnectionPositionPair) => {
      return new ConnectionPositionPair(
        { originX: value.originX, originY: value.originY },
        { overlayX: value.overlayX, overlayY: value.overlayY },
        this.getNewOffsetValue(value.offsetX || 0),
        this.getNewOffsetValue(value.offsetY || 0),
        undefined,
      );
    });
  }

  private getNewOffsetValue(prevOffset: number): number {
    if (!prevOffset) {
      return 0;
    }
    return prevOffset > 0 ? VERTICAL_INDENT_WITHOUT_ARROW : -VERTICAL_INDENT_WITHOUT_ARROW;
  }

  private initConfig(): void {
    if (this.config) {
      this.config.maxWidth ??= TOOLTIP_MAX_WIDTH;
    } else {
      this.config = new OverlayConfig({
        maxWidth: TOOLTIP_MAX_WIDTH,
      });
    }
  }
}
