import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;

  constructor( public socket: Socket) {
    if( this.socketStatus == false) {
      this.checkStatus();
    }
  }

  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
      this.cargarStorage();
    });
    this.socket.on('disconnect', () => {
      console.log('Desconectado al servidor');
      this.socketStatus = false;
    });
  }

  emit( evento: string, payload?: any, callback?: Function ) {
    this.socket.emit(evento, payload, callback);
  }

  listen( evento: string) {
    return this.socket.fromEvent( evento );
  }

  enroll(code: string, phone: string, email: string) {
    console.log('Enrol ! ! !');
    return new Promise( (resolve, reject) => {
      this.emit('app:enroll', { code, phone, email }, (res) => {
        resolve(res);
      });
    });
  }

  queue(code: string, phone: string, email: string) {
    console.log('Queue ! ! !');
    return new Promise( (resolve, reject) => {
      this.emit('app:queue', { code, phone, email }, (res) => {
        resolve(res);
      });
    });
  }

  updateEnroll( code: string ) {
    console.log('Update Enrol ! ! !');
    return new Promise( (resolve, reject) => {
      this.emit('app:updateenroll', { code }, (res) => {
        resolve(res);
      });
    });
  }

  listenEnroll() {
    return this.listen('app:enroll');
  }

  listenNotify() {
    return this.listen('app:notify');
  }

  cargarStorage() {
    if ( localStorage.getItem('student') ) {
      const student: any = JSON.parse(localStorage.getItem('student'));
      this.updateEnroll(student.codigoAlumno);
    }
  }

    listenNotification() {
        return this.listen('app:notification');
      }
    
}