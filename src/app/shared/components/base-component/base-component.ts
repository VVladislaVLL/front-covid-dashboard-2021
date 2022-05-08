import { Directive, OnDestroy } from '@angular/core';
import { Subscriptions } from '../../entities';

@Directive()
export class BaseComponent implements OnDestroy {
  public subscriptions: Subscriptions = new Subscriptions();

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
