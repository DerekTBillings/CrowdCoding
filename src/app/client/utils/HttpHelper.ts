import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {of} from 'rxjs/internal/observable/of';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {headers: new HttpHeaders({ 'Content-Type':  'application/json'})};

// const SERVICE_URL = 'http://localhost:4200';
const SERVICE_URL = 'https://codesource.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class HttpHelper {

  errorMessage: string;

  constructor(private http: HttpClient) { }

  post(url: string, params: any): Observable<any> {
    return this.http.post<any>(SERVICE_URL + url, params, httpOptions)
      .pipe(
        tap( // Log the result or error
          data => console.log(data),
          error => this.handleError('error', error)
        ));
  }

  get(url: string): Observable<any> {
    return this.http.get<any>(SERVICE_URL + url, httpOptions)
      .pipe(
        tap( // Log the result or error
          data => console.log(data),
          error => this.handleError('error', error)
        ));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
