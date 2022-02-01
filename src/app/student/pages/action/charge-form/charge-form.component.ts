import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../../../services/student.service';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-charge-form',
  templateUrl: './charge-form.component.html',
  styleUrls: ['./charge-form.component.scss']
})
export class ChargeFormComponent implements OnInit {
  user: any = this.session.getObject('user');
	student: any = this.session.getObject('student');
  public showMessageBenefit:boolean = false;
  loading = false;
  public notAllowToGenerateCharge:boolean = false;
  // BENEFICIO SOLIDARIO
  allTypes:Array<any> = [];
  public charge = {
    grade: '',
    type: '',
    payment: 'COSTO'
  }
  constructor(private session: SessionService,
		public toastS: ToastrService,
		private studentS: StudentService) { }

  ngOnInit() {
  }

  loadTypes(type){
    if(type != ''){
      this.studentS.getChargeTypes(type)
      .then((res) => {
        this.allTypes = res;
      });
    } else {
      this.toastS.error('Debes seleccionar un Grado');
    }
  }

  createCharge(){
    if(this.notAllowToGenerateCharge){
      this.toastS.warning('Por favor, cierra el mensaje de cargo generado.');return};
    if(this.charge.grade == '' || this.charge.type == ''){
      this.toastS.warning('Falta seleccionar datos');
    } else {
      let dataCharge = (this.charge.grade=='PREGRADO'?'PREGR':'PSTGR') + this.charge.type + this.student.ciclo_lectivo + this.student.codigoAlumno;
      this.studentS.generateChargeXML(dataCharge)
        .then((res) => {
          this.notAllowToGenerateCharge = true;
          this.toastS.success('Éxito! Se generó su cargo correctamente.', '', {closeButton: true, disableTimeOut: true,tapToDismiss: false}).onHidden.subscribe((res => {
            this.notAllowToGenerateCharge = false;
          }));
          this.showMessageBenefit = false;
          this.charge.grade = '';
          this.charge.type = '';
        });
    }
  }

  selectedGrade(){
    this.showMessageBenefit = this.charge.type=='150500000202'?true:false;
  }

}