import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppSettings } from '../app.settings';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

	constructor(private http: HttpClient, 
		private generalS: GeneralService) { }

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
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/getFinalGrades', data).toPromise();
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

}
