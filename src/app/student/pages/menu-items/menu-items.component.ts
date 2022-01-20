import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { NewEnrollmentService } from 'src/app/services/newenrollment.service';
import { SessionService } from '../../../services/session.service';
import { Gtag } from 'angular-gtag';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Broadcaster } from '../../../services/broadcaster';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})
export class MenuItemsComponent implements OnInit, OnChanges {
  @Input('widthMenu') widthMenu: number;
  queueEnroll: any;
  enroll:any;
  enroll_conditions: any = '';
  crossdata:any;
  showMatri:boolean = false;
  timeOut:boolean = false;
  constructor(
    private studentS: StudentService,
    public session: SessionService,
    private toastr: ToastrService,
    private broadcaster: Broadcaster,
    private router: Router,
    public newEnrollmentS: NewEnrollmentService,
    private gtag: Gtag,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.widthMenuValid = this.widthMenu;
      this.showMatri = true;
    }, 100);
    this.crossdata = this.broadcaster.getMessage().subscribe(msg => {
      if (msg && msg.enroll ) {
				this.showMatri = true;
			}
      else if(msg && msg.conditions){
        this.loadConditions();
      }
    });
  }

  public showDoc = false;
  public widthMenuValid = 0;

  ngOnInit() {
    this.loadEnroll();
    // this.loadConditions();
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

  loadEnroll(){
    this.studentS.getEnrollQueueNumber(this.session.getItem('emplidSelected'))
      .then((res) => {
        this.queueEnroll = res.UCS_GRUPO_MAT_RES;
        this.timeOut = this.queueEnroll.onTurn;
        if(!this.timeOut) {
          this.readTurn(this.timeOut);
        }
      });
  }
  
  loadConditions(){
    this.newEnrollmentS.checkConditions(this.session.getItem('emplidSelected'))
      .then((res) => {
        this.enroll = true;
        this.enroll_conditions = res;
        this.broadcaster.sendMessage({enroll_conditions: this.enroll_conditions})
      });
  }

  readTurn(showBtn){
    if(!showBtn){
      setTimeout(() => {
        this.loadEnroll();
      }, 60000)
    };
  }

  linkModalOpen() {
    this.gtag.event('academic_documents', { 
      method: 'click',
      event_category: 'modal'
    });
    this.studentS.setShowdocLoad(true);
  }

  linkUpdateOpen(){
    this.gtag.event('update_fields', { 
      method: 'click',
      event_category: 'modal'
    });
    this.studentS.setUpdateModal(true);
  }

  matriculaExtracurricularModalOpen(){
    this.studentS.setShowMatricula(true);
  }

  showScheduleModal(){
    this.studentS.setShowScheduleModal(true);
  }

  openModal(type, ready){
    if(type == 'A'){
      this.studentS.setAcademicModal(ready);
    } else {
      this.studentS.setFinancialModal(ready);
    }
  }

  goEnrollment(){
    this.newEnrollmentS.checkConditions(this.session.getItem('emplidSelected'))
      .then((res) => {
        if(res.FLAG_FINANCIERO == 'Y' && res.FLAG_ACADEMICO == 'Y'){
          this.session.setObject('conditionsToEnrollment', { turn: this.timeOut, conditions: true });
          // this.newEnrollmentS.getDebt(this.session.getItem('emplidSelected'))
          // .then((res) => {
            // let notdeuda = res['UCS_WS_DEU_RSP']['UCS_WS_DEU_COM'][0]['DEUDA'] == 'N' ? true : false;
            // if (!notdeuda) {
            //   this.toastr.error('Tiene una deuda pendiente, por favor regularizar el pago.');
            // } else {
              this.router.navigate(['/estudiante/matricula/disponibles']);
            // }
          // });
        } else {
          if(res.FLAG_FINANCIERO == 'N'){
            this.toastr.warning('Todavia no aceptas las condiciones financieras','',{progressBar:true});
          } else {
            this.toastr.warning('Todavia no aceptas las condiciones academicas','',{progressBar:true});
          }
        }
      });
  }

}