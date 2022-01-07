import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { NewEnrollmentService } from 'src/app/services/newenrollment.service';
import { SessionService } from '../../../services/session.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-other',
  templateUrl: './menu-other.component.html',
  styleUrls: ['./menu-other.component.scss']
})
export class MenuOtherComponent implements OnInit {

  @Input('heightOther') heightOther: number;
  @Output('heightOtherEmit') heightOtherEmit = new EventEmitter();
  public dataRemotex = '';
  constructor(
    private studentService:StudentService,
    public session: SessionService,
    private toastr: ToastrService,
    private router: Router,
    public newEnrollmentS: NewEnrollmentService,
  ) { }

  ngOnInit() {
    this.dataRemotex = this.session.getObject('remotex');
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
            let notdeuda = res['UCS_WS_DEU_RSP']['UCS_WS_DEU_COM'][0]['DEUDA'] == 'N' ? true : false;
            if (!notdeuda) {
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
}
