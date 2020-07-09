import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { TooltipModule, TooltipOptions } from '@teamhive/ngx-tooltip';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { StudentService } from '../services/student.service';
import { IntentionService } from '../services/intention.service';
import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActionComponent } from './pages/action/action.component';
import { WeeklyScheduleComponent } from './pages/action/weekly-schedule/weekly-schedule.component';
import { PersonalInformationComponent } from './pages/action/personal-information/personal-information.component';
import { AcademicConditionsComponent } from './pages/action/academic-conditions/academic-conditions.component';
import { AccountStatusComponent } from './pages/action/account-status/account-status.component';
import { CourseHistoryComponent } from './pages/action/course-history/course-history.component';
import { FinalGradesComponent } from './pages/action/final-grades/final-grades.component';
import { CourseAssistanceComponent } from './pages/action/course-assistance/course-assistance.component';

@NgModule({
  declarations: [StudentComponent, DashboardComponent, ActionComponent, WeeklyScheduleComponent, PersonalInformationComponent, AcademicConditionsComponent, AccountStatusComponent, CourseHistoryComponent, FinalGradesComponent, CourseAssistanceComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgxSmartModalModule.forRoot(),
    ToastrModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    DeviceDetectorModule.forRoot(),
    TooltipModule.forRoot({
          placement: 'left',
          arrow: true,
          arrowType: 'sharp',
          allowHTML: true,
          maxWidth: 200
      } as TooltipOptions),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CommonModule,
    StudentRoutingModule
  ],
  providers: [
    StudentService,
    IntentionService
  ],
})
export class StudentModule { }
