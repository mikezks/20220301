import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, share, Subscription, tap, timer } from 'rxjs';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css']
})
export class FlightTypeaheadComponent implements OnInit, OnDestroy {
  timer$: Observable<number> = this.getInitTimerStream();
  subscriptions = new Subscription();

  constructor() { }

  ngOnInit(): void {
    this.rxjsDemo();
  }

  rxjsDemo(): void {
    this.subscriptions.add(
      this.timer$.subscribe(console.log)
    );
  }

  getInitTimerStream(): Observable<number> {
    return timer(0, 2_000).pipe(
      tap(num => console.log('Observable Producer', num)),
      // share()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
