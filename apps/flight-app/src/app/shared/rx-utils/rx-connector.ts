import { Injectable, OnDestroy } from "@angular/core";
import { Observable, PartialObserver, Subscription } from "rxjs";

@Injectable()
export class RxConnector implements OnDestroy {
  private subscription = new Subscription();

  connect<T>(
    stream$: Observable<T>,
    observer?: PartialObserver<T>
  ): Subscription {
    const subscription = stream$.subscribe(observer);
    this.subscription.add(subscription);
    return subscription;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
