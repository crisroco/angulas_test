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
  loading = false;
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
      this.loading = true;
      this.studentS.getChargeTypes(type)
      .then((res) => {
        this.allTypes = res;
        this.loading = false;
      });
    } else {
      this.toastS.error('Debes seleccionar un Grado');
    }
  }

  createCharge(){
    if(this.charge.grade == '' || this.charge.type){
      this.toastS.warning('Falta seleccionar datos');
    } else {

    }
  }

}
