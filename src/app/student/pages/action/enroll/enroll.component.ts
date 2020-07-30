import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { SessionService } from '../../../../services/session.service';
import { Broadcaster } from '../../../../services/broadcaster';
import { RealDate } from '../../../../helpers/dates';
import * as moment from 'moment';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.scss']
})
export class EnrollComponent implements OnInit {
  countDownEnroll = '';
  countDownEnrollTime = null;
  enroll: { wait: boolean , status: number, numero: number } = { wait: true , status: 0, numero: 0 };
  user: any = this.session.getObject('user');
  student: any = this.session.getObject('student');
  crossdata: any;
  enroll_conditions: any;
  queueEnroll: any;
  timeoutEnroll: any;
  enrolldata: any;
  realDate: any = RealDate();

  constructor(public wsService: WebsocketService,
    private broadcaster: Broadcaster,
    private session: SessionService) { 
      this.ngOnInit();
  }

  ngOnInit() {
    this.getDataEnroll();
  }

  getDataEnroll(){
    this.broadcaster.sendMessage({getEnroll: 'Y'});
    this.crossdata = this.broadcaster.getMessage().subscribe(message => {
      if (message && message.enroll_conditions) {
        this.enroll_conditions = message.enroll_conditions;
        console.log('enrolled');
      }
      else if (message && message.queueEnroll) {
        this.timeoutEnroll = true;
        this.queueEnroll = message.queueEnroll;
        this.setRealDateEnroll();
      }
      else if (message && message.enroll) {
        this.enrolldata = message.enroll;
      }
      else if (message && message.initSocket && message.initSocket == 'Y'){
         
      }
    });
  }

  setRealDateEnroll(){
    this.realDate = RealDate();
    console.log('ejecuta');
    if(this.realDate.timeseconds >= this.queueEnroll.date.timeseconds) {
      this.timeoutEnroll = false;
      this.initSocket();
    }
    setTimeout(() => {
      if(this.timeoutEnroll){
        this.setRealDateEnroll();
      }
    }, 5000);
  }

  initSocket(){
    this.wsService.enroll(this.student.codigoAlumno, '990051584', 'vallejoaguilar@gmail.com')
    .then( (res: any) => {
      console.log('check!', res);
      if (res.ok) {
        this.enroll.wait = false;
        this.enroll.status = 1;
        this.countDown(res.data.dateCurrent, res.data.dateEnd);
      } else {
        this.enroll.wait = false;
        this.enroll.status = 0;
        this.enroll.numero = res.data.count;
      }
    })
    .catch( err => {
      console.log('catch!', err);
    });
    this.wsService.listenEnroll().subscribe( (res: any) => {
      console.log('enroll -> ', res);
      this.enroll.wait = false;
      this.enroll.status = 1;
      this.countDown(res.dateCurrent, res.dateEnd);
    });
    this.wsService.listenNotify().subscribe( (res: any) => {
      console.log('notify', res);
      this.enroll.numero = res.index + 1;
    });
  }

  countDown(dateBegin, dateEnd) {
    const eventTime = new Date(dateEnd).getTime();
    const currentTime = new Date(dateBegin).getTime();
    const diffTime = eventTime - currentTime;
    const duration = moment.duration(diffTime, 'milliseconds');
    const interval = 1000;
    let durationNumber = Number(duration);

    this.countDownEnrollTime = setInterval(() => {
      durationNumber = durationNumber - interval;
      const duration2 = moment.duration(durationNumber, 'milliseconds');
      // tslint:disable-next-line:max-line-length
      this.countDownEnroll = this.pad(duration2.hours(), 2) + ':' + this.pad(duration2.minutes(), 2) + ':' + this.pad(duration2.seconds(), 2);

      if (this.countDownEnroll === '00:00:00') {
        this.enroll.status = 2;
        this.stopCountDown();
      }
    }, interval);
  }

  stopCountDown() {
    clearInterval(this.countDownEnrollTime);
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) { s = '0' + s; }
    return s;
  }

  queue() {
    this.enroll.wait = true;
    this.wsService.queue(this.student.codigoAlumno, '990051584', 'vallejoaguilar@gmail.com')
        .then( (res: any) => {
          console.log('queue!', res);
          if (res.ok) {
            this.enroll.wait = false;
            this.enroll.status = 1;
            this.countDown(res.data.dateCurrent, res.data.dateEnd);
          } else {
            this.enroll.wait = false;
            this.enroll.status = 0;
            this.enroll.numero = res.data.count;
          }
        });
  }

  matricula() {
    //http://127.0.0.1:5500/psp/CS90PRD/?cmd=login
    // window.open(`https://academico.sise.edu.pe/psp/CS90PRD/?cmd=login&up=${localStorage.getItem('up')}`, '_blank');
    window.open(`http://52.184.160.28:8040/psp/CS90TST/?cmd=login&languageCd=ESP&up=${localStorage.getItem('up')}`, '_blank');
    // window.open(`http://52.184.160.28:8040/psp/CS90DEV/?cmd=login&languageCd=ESP&up=${localStorage.getItem('up')}`, '_blank');
    // window.open(`http://testmatricula.cientifica.edu.pe/psp/CS90DEV/?cmd=login&languageCd=ESP&up=${localStorage.getItem('up')}`, '_blank');
  }

  ngOnDestroy(){
    console.log('eliminado');
    this.crossdata.unsubscribe();
  }

}
