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
    public setupdatemodal = new Subject<boolean>();
    public showMatricula = new Subject<boolean>();
    public showScheduleLogin = new Subject<boolean>();
    public showAcademic = new Subject<boolean>();
    public showFinancial = new Subject<boolean>();
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

    public getUpdateModal() {
        return this.setupdatemodal.asObservable();
    }

    public setUpdateModal(data: boolean) {
        this.setupdatemodal.next(data);
    }

    public getShowMatricula() {
        return this.showMatricula.asObservable();
    }

    public setShowMatricula(data: boolean) {
        this.showMatricula.next(data);
    }

    public setShowScheduleModal(data:boolean){
        this.showScheduleLogin.next(data);
    }

    public getShowScheduleModal(){
        return this.showScheduleLogin.asObservable();
    }

    public setAcademicModal(data: boolean) {
        this.showAcademic.next(data);
    }

    public getAcademicModal() {
        return this.showAcademic.asObservable();
    }

    public setFinancialModal(data: boolean) {
        this.showFinancial.next(data);
    }

    public getFinancialModal() {
        return this.showFinancial.asObservable();
    }

    public triesLogin(): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/triesLogin').toPromise();
    }

    public getDataStudent(oprid = '1'): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getDataStudent/' + oprid).toPromise();
    }

    public getPhoneStudent(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getPhoneStudent', data).toPromise();
    }

    public getAcademicDataStudent(code = '1'): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getAcademicDataStudent/' + code, {}).toPromise();
    }

    public getScheduleStudent(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getScheduleStudent', data).toPromise();
    }

    public getAdStudent(code): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getAdStudent/' + code, {}).toPromise();
    }

    public getAccountStatus(emplid = '1'): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getAccountStatus/' + emplid).toPromise();
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

    public getWeightedAverage(career, program, emplid = '1'): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getWeightedAverage/' + career + '/' + program + '/' + emplid, {}).toPromise();
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

    public getEnrollQueueNumber(emplid = '1'): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getEnrollQueueNumber/' + emplid).toPromise();
    }

    public getSTRM(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getSTRM', data).toPromise();
    }

    public getPersonalData(emplid = '1'): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.PERSONAL_DATA + '/getPersonalData/' + emplid).toPromise();
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

    public async getAllClasses(data): Promise<any> {
        return await this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getAllClass', data).toPromise();
    }
    
    public getLinkZoom(cicle, myclass, date, teacher, section, inst): Promise<any> {
        let url = "https://cientificamoodle.cientifica.edu.pe//mod/zoom/client/zoom_link.php?strm=";
        if(cicle == '1072' || cicle == '1073' || cicle == '1117' || cicle == '1118' || cicle == '1156' || cicle == '1157' || cicle == '2220' || cicle == '2222' || cicle == '2225' || cicle == '2228' || cicle == '2235' || cicle == '2237' || cicle == '2238' || cicle == '2210' || cicle == '2224' || cicle == '0965' || cicle == '2236' || cicle == '1031' || cicle == '1128' || cicle == '2221' || cicle == '1030' || cicle == '2228' || cicle == '2226' || cicle == '1116' || cicle == '2239' || cicle == '1125' || cicle == '1081' || cicle == '2240'){
            url = "https://aulavirtualcpe.cientifica.edu.pe/mod/zoom/client/zoom_link.php?strm=";
        }
        return this.http.get(url + cicle + '&nbr=' + myclass + '&date=' + date + '&teacher=' +  teacher.replaceAll('?','@@') + '&section=' + section + '&institution=' + inst, { responseType: 'text' }).toPromise();
    }
    public getFidelityLink(emplid): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getFidelitySurvey/' + emplid).toPromise();
    }

    public getListOfStudentsJson(): Promise<any> {
        return this.http.get("assets/students.json").toPromise();
    }

    public async getListOfInterStudentsJson(): Promise<any> {
        return await this.http.get("assets/inter_students.json").toPromise();
    }

    public async PREGRADOStudents(): Promise<any> {
        return await this.http.get("assets/pregrado_students.json").toPromise();
    }

    public async CPEStudents(): Promise<any> {
        return await this.http.get("assets/cpe_students.json").toPromise();
    }

    public async BBDDBibliotecaPre(): Promise<any> {
        return await this.http.get("assets/bbdd-biblioteca-pre.json").toPromise();
    }

    public async BBDDCesPre(): Promise<any> {
        return await this.http.get("assets/bbdd-ces-pre.json").toPromise();
    }

    public async BBDDMatriculaPre(): Promise<any> {
        return await this.http.get("assets/bbdd-matricula-pre.json").toPromise();
    }

    public async BBDDPosCes(): Promise<any> {
        return await this.http.get("assets/bbdd-pos-ces.json").toPromise();
    }

    public async BBDDPosMatricula(): Promise<any> {
        return await this.http.get("assets/bbdd-pos-matricula.json").toPromise();
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

    public getFileUpload(emplid = '1'): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.STUDENT + '/getUploadbyEmplid/' + emplid).toPromise();
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

    public sendUploadPS(): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/sendUploadPS', {}).toPromise();
    }

    public existEthnicity(): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/existe_etnia', {}).toPromise();
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