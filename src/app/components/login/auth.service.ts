import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { User } from './models/user.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {

  private baseUrl = environment.baseUrl;
  private tokenUrl = `${this.baseUrl}/o/token/`;
  private userDetailsUrl = `${this.baseUrl}/api/current-user`;
  private revokeTokenUrl = `${this.baseUrl}/o/revoke_token/`;
  private token: string;
  private user: User;

  ids = 
  {
    hayat: 'RNQ3RPORhKsWDHBU5dvzQyHQExxEIB49kmbK8Z4Q',
    wf: 'd70e5uXwpGKrLZY9XsEWH8yvSDpGV02G6oSmzjJN',
    faiz: 'd70e5uXwpGKrLZY9XsEWH8yvSDpGV02G6oSmzjJN'
  }
  clientId: string = this.ids.wf;

  constructor(private http: HttpClient) {}
  hasGroup(lookupGroup: string): boolean {
    if (this.user == null) {
      return false;
    }

    if (this.user.groups != null) {
      const group: any = this.user.groups.find(k => k.name === lookupGroup);
      if (group != null) {
        return true;
      }
    }

    return false;
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getExpiry(): number {
    let x = localStorage.getItem('expires');
    if (x == null) {
      return 0;
    }

    return Number(x);
  }

  getRefreshToken(): string {
    return localStorage.getItem('refresh_token');
  }

  refreshToken(): Observable<string> {
    if (!this.getRefreshToken()) {
      this.clear();
      return of(null);
    }

    //console.log('=== refresh-token ===', this.getRefreshToken());
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    };
    const body = new HttpParams()
      .set('refresh_token', this.getRefreshToken())
      .set('client_id', this.clientId)
      .set('grant_type', 'refresh_token');
    return this.http.post(this.tokenUrl, body.toString(), httpOptions).pipe(
      map(res => this.extractToken(res)),
      catchError(e => this.handleError(e))
    );
  }

  authenticate(username: string, password: string): Observable<string> {
    //TODO: temp
    // return this.http.get(this.tokenUrl)
    //   .map((res: any) => this.extractToken(res));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    };
    // wingfi client_id: nUua04qZCaCyyarmflZKqknVSt2u5UsDPo5ZZyRY
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('client_id', this.clientId)
      .set('grant_type', 'password');
    return this.http.post(this.tokenUrl, body.toString(), httpOptions).pipe(
      map(res => this.extractToken(res)),
      catchError(e => this.handleError(e))
    );
    // return this.http.post(this.tokenUrl, body.toString(), httpOptions)
    //   .map((res: HttpResponse<any>) => this.extractToken(res))
    //   .catch((e: any) => this.handleError(e));
  }

  logoff() {
    let token = this.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    };
    const body = new HttpParams()
      .set('token', token)
      .set('client_id', this.clientId)
    return this.http.post(this.revokeTokenUrl, body.toString(), httpOptions).subscribe((res)=>{
      console.log(res)
    })
  }

  handleError(e): string {
    if (e.status && (e.status == 401 || e.status == 403)) {
      return;
    }
    
    //console.log('=== auth error ===', e);
    throw('invalid_grant');
  }

  hasValidToken(): boolean {
    //console.log('current token', this.getToken());
    return !!this.getToken();
  }

  isTokenExpired(): boolean {
    let expired = false;
    if (this.getExpiry() == null) {
      return expired;
    }
    
    expired = this.getExpiry() < new Date().getTime();
    //console.log('isTokenExpired', expired);
    return expired;
  }
 
  clear(): void {
    this.logoff();
    localStorage.clear();
    // .subscribe(res => {
    // });
  }

  extractToken(res: any): string {
    localStorage.setItem('token', res.access_token);
    localStorage.setItem('refresh_token', res.refresh_token);
    let exp = res.expires_in;
    let dt = new Date();
    dt.setTime(dt.getTime() + exp * 1000);
    localStorage.setItem('expires', dt.getTime().toString());
    return this.token = res.access_token;
  }

  getUser(): User {
    return this.user;
  }

  queryUserDetails(): Observable<User> {
    return this.http.get(this.userDetailsUrl).pipe(
      map(res => {
        const entity = Object.assign(new User(), res);
        this.user = entity;
        localStorage.setItem('user', JSON.stringify(entity));
        return entity;
      })
    );
  }
}