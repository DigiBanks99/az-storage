import {Component, Inject, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, of, startWith, tap} from "rxjs";

@Component({
  selector: 'app-fetch-data-display',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataDisplayComponent {
  @Input() public isLoading = false;
  @Input() public forecasts: WeatherForecast[] = [];
}

@Component({
  selector: 'app-fetch-data',
  template: `
  <app-fetch-data-display
    [isLoading]="(isLoading$ | async) ?? false"
    [forecasts]="(forecasts$ | async) ?? []"
  ></app-fetch-data-display>`
})
export class FetchDataComponent {
  public forecasts$: Observable<WeatherForecast[]>;
  public isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.isLoading$.next(true);
    this.forecasts$ = http.get<WeatherForecast[]>(baseUrl + 'api/weatherforecast')
      .pipe(
        tap(() => this.isLoading$.next(false)),
        catchError((e) => {
          console.error(e);
          return of([]);
        }));
  }
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
