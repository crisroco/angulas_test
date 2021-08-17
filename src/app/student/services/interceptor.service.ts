import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SessionService } from 'src/app/services/session.service';
import { StudentService } from 'src/app/services/student.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private _s:SessionService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((m: HttpResponse<any>) => {
        if (m instanceof HttpResponse && req.url.indexOf('zoom_link.php') !== -1) {
          if(m.body.trim()=='false2'){
            this._s.seterrorModal(true);
          }
        }
        return m
      }),
      catchError(e => {
        // this._s.setemitModalError();
        return throwError(e);
      })
    );
  }
}
