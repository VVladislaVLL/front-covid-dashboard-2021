import { Subscription } from 'rxjs';

export class Subscriptions {
  public subscriptions: Subscription[];

  public static unsubscribe(collection: Subscription[]): void {
    collection.forEach((s: Subscription) => {
      if (s && s.unsubscribe) {
        s.unsubscribe();
      }
    });
  }

  constructor() {
    this.subscriptions = [];
  }

  public add(s: Subscription | Subscription[]): void {
    if (Array.isArray(s)) {
      this.subscriptions = [...this.subscriptions, ...<Subscription[]> s];
    } else {
      this.subscriptions.push(<Subscription> s);
    }
  }

  public unsubscribe(): void {
    Subscriptions.unsubscribe(this.subscriptions);
  }
}
