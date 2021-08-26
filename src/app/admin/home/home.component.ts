import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from 'src/app/app.settings';
import { NewEnrollmentService } from 'src/app/services/newenrollment.service';
import { StudentService } from '../../services/student.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('selecStudentModal') selecStudentModal: any;
  @ViewChild('selecEnrollmentModal') selecEnrollmentModal: any;
  @ViewChild('confirmationUploadModal') confirmationUploadModal:any;
  user = this.session.getObject('user');
  userBackOffice = this.session.getItem('userBackOffice');
  studentCode;
  isthisStudent;
  modalClose;
  allData: any;
  loading: boolean = false;
  company = AppSettings.COMPANY;

  constructor(
    public toastr: ToastrService,
    public newEnrollmentS: NewEnrollmentService,
    public session: SessionService,
    public studentS: StudentService,
    private router: Router,
  ) { }

  ngOnInit() {

    if (this.userBackOffice === "personalMiPortal") {
      this.modalClose = false;
      this.selecStudentModal.open();
    }
    if (this.userBackOffice === "personalMatricula") {
      this.modalClose = false;
      this.selecEnrollmentModal.open();
    }
    if (this.userBackOffice === "personalBothProcess") {
      this.modalClose = true;
    }
  }

  selectProcess1() {
    this.selecStudentModal.open();
  }

  selectProcess2() {
    this.selecEnrollmentModal.open();
  }

  search() {
    if (!this.studentCode) {
      this.toastr.error("Ingresa un codigo de alumno");
      return
    }
    // this.newEnrollmentS.getDebt({EMPLID: this.studentCode})
    //   .then((res) => {
    //     if(res.UCS_WS_DEU_RSP.UCS_WS_DEU_COM[0]['DEUDA'] == 'N'){

    //     } else {
    //       this.toastr.warning('El alumno tiene deuda');
    //     }
    //   });
    this.newEnrollmentS.getDataStudentEnrollment({ EMPLID: this.studentCode })
      .then((res) => {
        this.isthisStudent = res['UCS_DATPERS_RSP']['UCS_DATPERS_COM'][0];
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
    this.studentS.getAcademicDataStudent({ code: this.studentCode }).then((res) => {
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
        email: this.session.getObject('mySelectedStudent').OPRID //SERVICIO DEBE TRAER EL CORREO DEL STUDIANTE SELECCIONADO
      },
      this.session.setObject('user', this.user);
      this.session.setItem('notRemotex', true);
      this.router.navigate(['estudiante']);
    });
  }

  select2() {
    this.loading = true;
    this.studentS.getAcademicDataStudent({ code: this.studentCode }).then((res) => {
      var units:Array<any> = res && res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta? res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta:[];
      this.allData = units.filter(item => item.institucion == 'PREGR')[0];
      if (this.allData === undefined){this.toastr.error('El alumno no existe en la BD.'); this.loading = false; return;}      
      this.session.setObject('acadmicData', this.allData);
      this.session.setObject('mySelectedStudent', this.isthisStudent);
      this.session.setItem('emplidSelected', this.studentCode);
      this.loading = false;
      this.selecEnrollmentModal.close();
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
      this.router.navigate(['admin/dashboard']);
    });
  }

  // Charge Student
  openConfirmation() {
    if (!this.studentCode) {
      this.toastr.error("Ingresa un codigo de alumno");
      return
    }
    this.confirmationUploadModal.open();
  }

  uploadData(){
    this.loading = true;
    this.newEnrollmentS.getSkillFullLoadAutoService({EMPLID: this.studentCode})
      .then((res) => {
        this.toastr.success('Carga completa del alumno');
        this.confirmationUploadModal.close();
        this.loading = false;
      })
  }

}