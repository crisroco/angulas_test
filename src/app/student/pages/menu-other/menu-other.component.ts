import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { NewEnrollmentService } from 'src/app/services/newenrollment.service';
import { SessionService } from '../../../services/session.service';
import { ToastrService } from 'ngx-toastr';
import { Gtag } from 'angular-gtag';
import { Router } from '@angular/router';
import { Broadcaster } from '../../../services/broadcaster';

@Component({
  selector: 'app-menu-other',
  templateUrl: './menu-other.component.html',
  styleUrls: ['./menu-other.component.scss']
})
export class MenuOtherComponent implements OnInit {

  @Input('heightOther') heightOther: number;
  @Output('heightOtherEmit') heightOtherEmit = new EventEmitter();
  public dataRemotex = {
    nombreAlumno: '',
    codigoAlumno: '',
    apellidoAlumno: ''
  };
  crossdata:any;
  timeOut:boolean = false;
  queueEnroll: any;
  constructor(
    private studentService:StudentService,
    public session: SessionService,
    private broadcaster: Broadcaster,
    private toastr: ToastrService,
    private gtag: Gtag,
    private router: Router,
    public newEnrollmentS: NewEnrollmentService,
  ) { }

  ngOnInit() {
    this.dataRemotex = this.session.getObject('remotex')?this.session.getObject('remotex'):this.session.getObject('user');
    this.loadEnroll();
  }

  loadEnroll(){
    this.studentService.getEnrollQueueNumber(this.session.getItem('emplidSelected'))
      .then((res) => {
        this.queueEnroll = res.UCS_GRUPO_MAT_RES;
        this.timeOut = this.queueEnroll.onTurn;
        if(!this.timeOut) {
          this.readTurn(this.timeOut);
        }
      });
  }

  readTurn(showBtn){
    if(!showBtn){
      setTimeout(() => {
        this.loadEnroll();
      }, 60000)
    };
  }

  linkModalOpen(){
    this.studentService.setemitDocOther(true);
  }

  logout(){
    this.studentService.setemitLogout(true);
  }

  enrollmentOpen(){
    this.newEnrollmentS.checkConditions(this.session.getObject('user').codigoAlumno)
      .then((res) => {
        if(res.FLAG_FINANCIERO == 'Y' && res.FLAG_ACADEMICO == 'Y'){
          this.session.setObject('conditionsToEnrollment', { turn: true, conditions: true });
          this.newEnrollmentS.getDebt(this.session.getItem('emplidSelected'))
          .then((res) => {
            // let notdeuda = res['UCS_WS_DEU_RSP']['UCS_WS_DEU_COM'][0]['DEUDA'] == 'N' ? true : false;
            // !notdeuda
            if (false) {
              this.toastr.error('Tiene una deuda pendiente, por favor regularizar el pago.');
            } else {
              this.router.navigate(['/estudiante/matricula/disponibles']);
            }
          });
        } else {
          this.toastr.warning('Todavia no aceptas las condiciones academicas','',{progressBar:true});
        }
      });
  }

  openVirtualRoom(){
    let inst = this.session.getObject('AllInst')[0].institucion;
    if(inst == 'PSTGR' || inst == 'ESPEC'){
      this.gtag.event('aulavirtial_pos_home', { 
        method: 'click',
        event_category: 'link'
      });
      window.open('https://aulavirtualposgrado.cientifica.edu.pe', '_blank')
    } else {
      this.gtag.event('aulavirtial_cpe_home', { 
        method: 'click',
        event_category: 'link'
      });
      window.open('https://cientificavirtual.cientifica.edu.pe', '_blank');
    }
  }

  showSchedule(){
    this.studentService.setShowScheduleModal(true);
  }

  showFirst(name){
		return name.split(' ')[0]
	}
}