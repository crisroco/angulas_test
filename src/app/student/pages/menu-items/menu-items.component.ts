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
    }, 100);
    this.crossdata = this.broadcaster.getMessage().subscribe(msg => {
      if (msg && msg.enroll ) {
        console.log(msg);
				this.showMatri = true;
			}
    });
  }

  public showDoc = false;
  public widthMenuValid = 0;

  ngOnInit() {
    this.loadEnroll();
  }


  loadEnroll(){
    this.studentS.getEnrollQueueNumber({EMPLID: this.session.getObject('user').codigoAlumno})
      .then((res) => {
        this.queueEnroll = res.UCS_GRUPO_MAT_RES;
        console.log(this.queueEnroll);
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

  goEnrollment(){
    this.session.setObject('conditionsToEnrollment', { turn: this.timeOut, conditions: true });
    this.router.navigate(['/estudiante/matricula/disponibles']);

    // this.newEnrollmentS.getDebt({ EMPLID: this.session.getObject('user').codigoAlumno })
    //   .then((res) => {
    //     let notdeuda = res['UCS_WS_DEU_RSP']['UCS_WS_DEU_COM'][0]['DEUDA'] == 'N' ? true : false;
    //     if (!notdeuda) {
    //       this.toastr.error('Tiene una deuda pendiente, por favor regularizar el pago.');
    //     } else {
    //       this.router.navigate(['/estudiante/matricula/disponibles']);
    //     }
    //   });
  }

}