import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

const httpOptions = {headers: new HttpHeaders({ 'Content-Type':  'application/json', 'port': 'process.env.PORT' || '3000' })};
const LOGIN_SERVICE_URL = '/services/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage: string;

  constructor(private http: HttpClient,
              private router: Router) { }

  ngOnInit() { }

  login(name: string, pass: string): void {
    this.errorMessage = '';
    const params = {
      username: name,
      password: pass
    };

    this.http.post<any>(LOGIN_SERVICE_URL, params, httpOptions)
      .pipe(
        tap( // Log the result or error
          data => console.log(data),
          error => this.handleError('error', error)
        ))
      .subscribe(res => {
        const success = res.success;

        if (!success || success === 'false') {
          this.errorMessage = 'Either the username or password was invalid!';
        } else {
          this.router.navigate(['/projects']);
        }
      });
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
