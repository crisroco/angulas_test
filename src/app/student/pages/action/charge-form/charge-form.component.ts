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
  constructor(private session: SessionService,
		public toastS: ToastrService,
		private studentS: StudentService) { }

  ngOnInit() {
    this.studentS.getChargeTypes('PREGRADO')
      .then((res) => {
        console.log(res);
      })
  }

}
