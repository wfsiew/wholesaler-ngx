import { Injectable } from '@angular/core';
import { 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor, 
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY, throwError } from 'rxjs';
import { switchMap, catchError, finalize, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../components/login/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private authService: AuthService,
    private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.applyCredentials(request, this.authService.getToken());

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
          case 403:
            return this.handle401Error(request, next);
  
          default:
            return throwError(error);
        }
      })
    );
  }

  applyCredentials(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.authService.getRefreshToken()) {
      //console.log('refresh token is null');
      return this.logoutUser(req, next);
    }

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      this.tokenSubject.next(null);
    
      return this.authService.refreshToken().pipe(
        switchMap((token: string) => {
          if (token) {
            this.tokenSubject.next(token);
            return next.handle(this.applyCredentials(req, token));
          }
    
          //console.log('refreshToken return null')
          return this.logoutUser(req, next);
        }),
        catchError(error => {
          //console.log('refreshToken error')
          return this.logoutUser(req, next);
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    }

    else {
      if (this.tokenSubject.value == null) {
        //console.log('no subject token')
        return this.logoutUser(req, next);
      }

      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.applyCredentials(req, token));
        })
      );
    }
  }

  logoutUser(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log('=== logoutUser ===');
    this.authService.clear();
    this.router.navigate(['/login']);
    //this.events.publish(AppConstant.EVENT_USER_LOGOUT);
    return EMPTY;
  }
}