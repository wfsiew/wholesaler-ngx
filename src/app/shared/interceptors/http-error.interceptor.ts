import { Injectable, Injector } from '@angular/core';
import { 
  HttpEvent, 
  HttpInterceptor, 
  HttpHandler, 
  HttpRequest, 
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppLocaleConstant } from '../constants/app-locale.constant';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor  implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private translateService: TranslateService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = error.error.message;
        }
        
        else if (error.name) {
          const s = error.name;
          if (String(s) == 'TimeoutError') {
            const e = AppLocaleConstant.getErrorLocale('timeout');
            this.translateService.get([e]).subscribe(res => {
              errorMessage = res[e];
            });
          }
        }

        else {
          // server-side error
          if (error.status == 400 || error.status == 404) {
            const e = AppLocaleConstant.getErrorLocale(error.error.error);
            this.translateService.get([e]).subscribe(res => {
              errorMessage = res[e];
            });
          }

          else if (error.status == 500) {
            errorMessage = error.error.message;
          }

          else if (error.status == 401 || error.status == 403) {
            return throwError(error);
          }

          else {
            errorMessage = JSON.stringify(error);
          }
        }

        return throwError(errorMessage);
      })
    );
  }
}