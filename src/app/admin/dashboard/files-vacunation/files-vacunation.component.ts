import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewEnrollmentService } from 'src/app/services/newenrollment.service';
import { StudentService } from '../../../services/student.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-files-vacunation',
  templateUrl: './files-vacunation.component.html',
  styleUrls: ['./files-vacunation.component.scss']
})
export class FilesVacunationComponent implements OnInit {
  public name:any = this.session.getItem('adminOprid');
  public allFilesV:Array<any> = [{tipo: 'Cartilla'}, {tipo: 'Exoneración'}];
  public type:any = '';
  constructor(
    public toastr: ToastrService,
    public newEnrollmentS: NewEnrollmentService,
    public session: SessionService,
    public studentS: StudentService
  ) { }

  ngOnInit() {
    console.log(this.name);
    this.studentS.getAllFilesV().then((res) => {
      this.allFilesV = res.data;
    });
  }

  changeType(type){
    this.allFilesV = this.allFilesV.sort((a) => a.tipo == type ? -1 : 1);
  }

}
