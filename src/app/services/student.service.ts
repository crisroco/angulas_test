import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AppSettings } from '../app.settings';
import { GeneralService } from './general.service';

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    constructor(private http: HttpClient,
        private generalS: GeneralService) { }

    public showdocLoad = new Subject<boolean>();
    public showMenu = new Subject<boolean>();
    public showOtherMenu = new Subject<boolean>();
    public showBiblioteca = new Subject<boolean>();
    public emitDocOther = new Subject<boolean>();
    public emitLogout = new Subject<boolean>();
    public dataStudent = new Subject<any[]>();

    public getdataStudent() {
        return this.dataStudent.asObservable();
    }

    public setdataStudent(data: any) {
        this.dataStudent.next(data);
    }

    public getemitDocOther() {
        return this.emitDocOther.asObservable();
    }

    public setemitDocOther(data: boolean) {
        this.emitDocOther.next(data);
    }
    public getemitLogout() {
        return this.emitLogout.asObservable();
    }

    public setemitLogout(data: boolean) {
        this.emitLogout.next(data);
    }

    public getshowOtherMenu() {
        return this.showOtherMenu.asObservable();
    }

    public setshowOtherMenu(data: boolean) {
        this.showOtherMenu.next(data);
    }

    public getshowBiblioteca() {
        return this.showBiblioteca.asObservable();
    }

    public setshowBiblioteca(data: boolean) {
        this.showBiblioteca.next(data);
    }

    public getshowMenu() {
        return this.showMenu.asObservable();
    }

    public setshowMenu(data: boolean) {
        this.showMenu.next(data);
    }

    public getShowdocLoad() {
        return this.showdocLoad.asObservable();
    }

    public setShowdocLoad(data: boolean) {
        this.showdocLoad.next(data);
    }

    public getDataStudent(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getDataStudent', data).toPromise();
    }

    public getPhoneStudent(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getPhoneStudent', data).toPromise();
    }

    public getAcademicDataStudent(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getAcademicDataStudent', data).toPromise();
    }

    public getScheduleStudent(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getScheduleStudent', data).toPromise();
    }

    public getAdStudent(code): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getAdStudent/' + code, {}).toPromise();
    }

    public getAccountStatus(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getAccountStatus', data).toPromise();
    }

    public getCourseHistory(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getCourseHistory', data).toPromise();
    }

    public getAcademicConditions(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getAcademicConditions', data).toPromise();
    }

    public getGlobalStatistics(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getGlobalStatistics', data).toPromise();
    }

    public getRequirements(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getRequirements', data).toPromise();
    }

    public getWeightedAverage(code, career, program): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getWeightedAverage/' + code + '/' + career + '/' + program, {}).toPromise();
    }

    public getFormuleCourse(class_nbr, strm): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getFormuleCourse/' + class_nbr + '/' + strm, {}).toPromise();
    }

    public getSchedule(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getSchedule', data).toPromise();
    }

    public getGradesCourses(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getGradesCourses', data).toPromise();
    }

    public getFinalGrades(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getFinalGrades2', data).toPromise();
    }

    public getActiveStrm(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getActiveStrm', data).toPromise();
    }

    public getVirtualClass(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getVirtualClass', data).toPromise();
    }

    public getAcademicStatus(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getAcademicStatus', data).toPromise();
    }

    public getAssistanceHistory(parturl): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getAssistanceHistory/' + parturl, {}).toPromise();
    }

    public getEnrollSchedule(parturl): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getEnrollSchedule/' + parturl, {}).toPromise();
    }

    public getCompleteConditions(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getCompleteConditions', data).toPromise();
    }

    public saveAcademicCondition(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/saveAcademicCondition', data).toPromise();
    }

    public saveFinancialCondition(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/saveFinancialCondition', data).toPromise();
    }

    public getEnrollQueueNumber(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getEnrollQueueNumber', data).toPromise();
    }

    public getSTRM(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getSTRM', data).toPromise();
    }

    public getPersonalData(code): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.PERSONAL_DATA + '/getPersonalData/' + code, {}).toPromise();
    }

    public savePersonalData(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.PERSONAL_DATA + '/savePersonalData', data).toPromise();
    }

    public updPhoneData(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/updPhoneData', data).toPromise();
    }

    public updEmailData(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/updEmailData', data).toPromise();
    }

    public getAllClasses(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getAllClass', data).toPromise();
    }
    
    public getLinkZoom(cicle, myclass, date, teacher, section, inst): Promise<any> {
        let url = "https://cientificavirtual.cientifica.edu.pe//mod/zoom/client/zoom_link.php?strm=";
        if(cicle == '1072' || cicle == '1073' || cicle == '1117' || cicle == '1118' || cicle == '1156' || cicle == '1157' || cicle == '2220' || cicle == '2222' || cicle == '2225' || cicle == '2235' || cicle == '2237' || cicle == '2238'){
            url = "https://aulavirtualcpe.cientifica.edu.pe/mod/zoom/client/zoom_link.php?strm=";
        }
        return this.http.get(url + cicle + '&nbr=' + myclass + '&date=' + date + '&teacher=' +  teacher + '&section=' + section + '&institution=' + inst, { responseType: 'text' }).toPromise();
    }
    public getFidelityLink(emplid): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getFidelitySurvey/' + emplid).toPromise();
    }

    public getListOfStudentsJson(): Promise<any> {
        return this.http.get("assets/students.json").toPromise();
    }

    public getListOfInterStudentsJson(): Promise<any> {
        return this.http.get("assets/inter_students.json").toPromise();
    }

    public medicineStudents(): Promise<any> {
        return this.http.get("assets/medicine_students.json").toPromise();
    }

    public CPEStudents(): Promise<any> {
        return this.http.get("assets/cpe_students.json").toPromise();
    }

    public PREStudents(): Promise<any> {
        return this.http.get("assets/pre_students.json").toPromise();
    }

    public POSStudents(): Promise<any> {
        return this.http.get("assets/pos_students.json").toPromise();
    }

    public getDeuda(code): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getDeuda/' + code).toPromise();
    }

    public getFileUpload(code): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getUploadbyEmplid/' + code).toPromise();
    }

    public getAllFilesV(): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getAllFilesV').toPromise();
    }

    public getFlagSendUpload(code): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getFlagSendUpload/' + code).toPromise();
    }

    public deleteUpload(code): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/deleteUpload/' + code).toPromise();
    }

    public sendUploadPS(data: any): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/sendUploadPS', data).toPromise();
    }

    public existEthnicity(data: any): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/existe_etnia', data).toPromise();
    }

    public saveEthnicity(data: any): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/guardar_etnia', data).toPromise();
    }

    public getDepartamento(data: any): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getDepartamento', data).toPromise();
    }
    public getProvincia(data: any): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getProvincia', data).toPromise();
    }
    public getDistrito(data: any): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getDistrito', data).toPromise();
    }

    public getAnswerStudent(emplid): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getAnswer/' + emplid).toPromise();
    }

    public saveAnswer(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/saveAnswer', data).toPromise();
    }

    public getListOfStudentsUbigeoJson(): Promise<any> {
        return this.http.get("assets/ubigeo.json").toPromise();
    }
}