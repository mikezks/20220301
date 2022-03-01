import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-lib';
import { catchError, debounceTime, delay, distinctUntilChanged, filter, map, Observable, of, share, Subscription, switchMap, tap, timer } from 'rxjs';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css']
})
export class FlightTypeaheadComponent implements OnInit, OnDestroy {
  timer$: Observable<number> = this.getInitTimerStream();
  subscriptions = new Subscription();

  control = new FormControl();
  flights$: Observable<Flight[]> = this.getFlights();
  loading = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.rxjsDemo();
  }

  getFlights(): Observable<Flight[]> {
    /**
     * Stream 1: Input control value changes
     * - Trigger
     * - Data Provider
     */
    return this.control.valueChanges.pipe(
      // Filter START
      filter(city => city.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
      // Filter END
      // Side-effect: Change of local state
      tap(() => this.loading = true),
      // delay(1000),
      /**
       * Stream 2: Backend API call -> Flight Array
       * - Data Provider
       */
      switchMap(city => this.load(city).pipe(
        catchError(() => of([]))
      )),
      // Side-effect: Change of local state
      tap(() => this.loading = false),
      // Transformation
      // map(flights => flights.filter(f => f.id > 2 && f.id < 7))
    );
  }

  /**
   * Stream 2: Backend API call -> Flight Array
   * - Data Provider
   */
  load(from: string): Observable<Flight[]>  {
    const url = "http://www.angular.at/api/flight";

    const params = new HttpParams()
                        .set('from', from);

    const headers = new HttpHeaders()
                        .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, {params, headers});
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
