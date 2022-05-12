import { Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSkeleton]',
})
export class SkeletonDirective implements OnChanges {
  @Input('appSkeleton') isLoading: boolean;
  @Input('appSkeletonSkeletonTemplate') skeletonTemplate: TemplateRef<any>;

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isLoading) {
      this.viewContainer.clear();

      if (changes.isLoading.currentValue) {
        this.viewContainer.createEmbeddedView(this.skeletonTemplate);
      } else {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    }
  }
}
