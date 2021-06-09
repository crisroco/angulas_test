import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppSettings } from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class NewEnrollmentService {

    constructor(private http: HttpClient) { }

    public getCoursesExtra(): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.CLIENT + '/getCoursesExtra').toPromise();
    }

    public getSchedulesCourse(data): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.CLIENT + '/getScheduleExtra/1116/' + data).toPromise();
    }

    public getCoursesExtraInEnrollment(data): Promise<any>  {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getCoursesExtraInEnrollment', data).toPromise();
    }

    public getAcademicData(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getAcademicData', data).toPromise();
    }

    public getSchedule(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getSchedule', data).toPromise();
    }

    public getScheduleBoffice(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getScheduleBoffice', data).toPromise();
    }

    public getSkillfullLoad(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getSkillfulLoad', data).toPromise();
    }

    public getSkillfulLoadBoffice(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getSkillfulLoadBoffice', data).toPromise();
    }

    public getDebt(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getDebt', data).toPromise();
    }

    public getSchoolCycle(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getSchoolCycle', data).toPromise();
    }

    public getScheduleStudent(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getScheduleStudent', data).toPromise();
    }

    public getAditionalCourses(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getAditionalCourses', data).toPromise();
    }

    public saveAditionalCourses(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/saveAditionalCourses', data).toPromise();
    }

    public saveCourseClass(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/saveCourseClass', data).toPromise();
    }

    public getCourseClass(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getCourseClass', data).toPromise();
    }

    public getEquivalentsCourses(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getEquivalentsCourses', data).toPromise();
    }
//este
    public deleteCourseClass(own_id): Promise<any> {
        return this.http.delete(AppSettings.BASE + AppSettings.CLIENT + '/deleteCourseClass/' + own_id).toPromise();
    }

    public deleteCourseClassByCrseId(emplid, crs_id): Promise<any> {
        return this.http.delete(AppSettings.BASE + AppSettings.CLIENT + '/deleteCourseClassByCrseId/' + emplid + '/' +  crs_id).toPromise();
    }

    public deleteCourseClassExtra(emplid, oprid ,data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/deleteCourseClass/' + emplid + '/' + oprid, data).toPromise();
    }

    public deleteCourseClassAdmin(own_id, admindemplid): Promise<any> {
        return this.http.delete(AppSettings.BASE + AppSettings.CLIENT + '/deleteCourseClass/' + own_id + '/' + admindemplid).toPromise();
    }

    public deleteCourseClassByCrseIdAdmin(emplid, crs_id, admindemplid): Promise<any> {
        return this.http.delete(AppSettings.BASE + AppSettings.CLIENT + '/deleteCourseClassByCrseId/' + emplid + '/' +  crs_id + '/' + admindemplid).toPromise();
    }

    public updateCourseClass(own_id, data): Promise<any> {
        return this.http.put(AppSettings.BASE + AppSettings.CLIENT + '/updateCourseClass/' + own_id, data).toPromise();
    }

    public processEnrollment(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/processEnrollment', data).toPromise();
    }

    public getScheduleAutoservice(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getScheduleAutoservice', data).toPromise();
    }

    public getDataStudentEnrollment(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/getDataStudentEnrollment', data).toPromise();
    }

    public massiveUpload(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/massiveUpload', data).toPromise();
    }

    public checkConditions(id): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.CLIENT + '/checkConditions/' + id).toPromise();
    }

    public saveConditions(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/saveConditions', data).toPromise();
    }

    public sendEmailSchedule(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.CLIENT + '/sendEmailSchedule', data).toPromise();
    }

}