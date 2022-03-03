import {Pipe, PipeTransform} from '@angular/core';
import { delay, map, Observable, of, startWith } from 'rxjs';

@Pipe({
  name: 'city',
  pure: true
})
export class CityPipe implements PipeTransform {

  transform(value: string, fmt?: string): Observable<string> {

    let result: string = value;

    let short, long;

    switch (value) {
      case 'Hamburg':
        short = 'HAM';
        long = 'Airport Hamburg Fulsbüttel Helmut Schmidt';
        break;
      case 'Graz':
        short = 'GRZ';
        long = 'Flughafen Graz Thalerhof';
        break;
      default:
        short = long = value; //'ROM';
    }

    const dataSource = of({ value: 'My City' }).pipe(
      delay(1_000)
    );

    if (fmt === 'short') {
      result = short;
    } else {
      result = long;
    }

    // dataSource.subscribe(data => result = data.value);

    return of(value);

    return dataSource.pipe(
      map(data => data.value),
      startWith('Init City')
    );
  }

}
