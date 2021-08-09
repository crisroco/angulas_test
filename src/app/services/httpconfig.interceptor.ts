import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { SessionService } from './session.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private router: Router, private student: SessionService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(request.url.indexOf('getEnrollQueueNumber')===-1 && request.url.indexOf('checkConditions')===-1){
            this.student.setloadingObserver(true);
        }
        
        const token: string = JSON.parse(localStorage.getItem('oauth'));
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token['access_token']) });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        if (request.url == 'http://educanet.back.educad.pe/resources_portal/access_ps') {
            request = request.clone({ headers: request.headers.delete('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json, text/plain') });

        return next.handle(request).pipe(
            catchError(err => {
                this.student.setloadingObserver(false);
                if (err.error == "Unauthorized.") {
                    this.router.navigate(['/login']);
                }
                return err;
            }),
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                }
                return event;
            }),
            finalize(() => {
                this.student.setloadingObserver(false);
            })
        );
    }
}