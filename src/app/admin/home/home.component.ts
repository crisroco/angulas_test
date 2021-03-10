import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from 'src/app/app.settings';
import { NewEnrollmentService } from 'src/app/services/newenrollment.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('selecStudentModal') selecStudentModal: any;
  user = this.session.getObject('user');
  studentCode;
  isthisStudent;
  allData: any;
  loading: boolean = false;  
  company = AppSettings.COMPANY;

  constructor(
    public toastr: ToastrService,
    public newEnrollmentS: NewEnrollmentService,
    public session: SessionService,    
    private router: Router,
  ) { }

  ngOnInit() {
    this.selecStudentModal.open();
  }

  search() {
    if (!this.studentCode) {
      this.toastr.error("Ingresa un codigo de alumno");
      return
    }
    this.newEnrollmentS.getDataStudentEnrollment({ EMPLID: this.studentCode })
      .then((res) => {
        this.isthisStudent = res['UCS_DATPERS_RSP']['UCS_DATPERS_COM'][0];
        console.log("IS THIS STUDENT: SERVICIO ACTUALIZADO");
        console.log(this.isthisStudent);
        if (!this.isthisStudent.NAME) {
          this.isthisStudent = '';
          this.studentCode = '';
          this.toastr.error('El alumno no existe');
          return;
        }
      });
  }

  select() {
    this.loading = true;
    this.newEnrollmentS.getDebt({ EMPLID: this.studentCode }).then((res) => {
      let notdeuda = res['UCS_WS_DEU_RSP']['UCS_WS_DEU_COM'][0]['DEUDA'] == 'N' ? true : false;
      if (notdeuda) {

        this.newEnrollmentS.getAcademicData({ EMPLID: this.studentCode }).then((res) => {
          this.allData = res[0];
          this.session.setObject('acadmicData', this.allData);
          this.session.setObject('mySelectedStudent', this.isthisStudent);
          //this.broadcaster.sendMessage({myStudent:this.studentCode});
          this.session.setItem('emplidSelected', this.studentCode);
          this.loading = false;
          this.selecStudentModal.close();
          let nombreCompleto = this.session.getObject('mySelectedStudent').NAME;
          let coma = nombreCompleto.indexOf(",");
          this.user = {
            nombreAlumno: nombreCompleto.substring(coma + 1),
            codigoAlumno: this.session.getItem('emplidSelected'),
            apellidoAlumno: nombreCompleto.substring(0, coma),
            nombre: this.session.getObject('mySelectedStudent').NAME,
            descripcion: "Inicio de sesión correcto.",
            ind_deuda: "",
            res_url: "",
            tipo_usuario: "A",
            tipo_usuario2: "Y",
            valor: "Y",
            email: this.session.getObject('mySelectedStudent').OPRID
          },
          this.session.setObject('user', this.user);
          this.router.navigate(['estudiante']);
        });
      } else {
        this.toastr.error('Tiene una deuda pendiente, por favor regularizar el pago.');
        this.loading = false;
      }
    });
  }

}
