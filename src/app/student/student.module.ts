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

import { AppSettings } from '../app.settings';
import { StudentService } from '../services/student.service';
import { IntentionService } from '../services/intention.service';
import { WebsocketService } from '../services/websocket.service';
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
import { EnrollComponent } from './pages/action/enroll/enroll.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { GtagModule } from 'angular-gtag';
import { EnrollmentComponent } from './pages/enrollment/enrollment.component';
import { DashboardEnrollComponent } from './pages/enrollment/dashboard-enroll/dashboard-enroll.component';
import { CoursesEnrollmentComponent } from './pages/enrollment/courses-enrollment/courses-enrollment.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { FooterComponent } from './pages/footer/footer.component';
import { MenuCourseComponent } from './pages/menu-course/menu-course.component';
import { MenuItemsComponent } from './pages/menu-items/menu-items.component';
import { MenuOtherComponent } from './pages/menu-other/menu-other.component';
import { NoticeComponent } from './pages/notice/notice.component';
import { HttpConfigInterceptor } from '../services/httpconfig.interceptor';
import { InterceptorService } from './services/interceptor.service';

const config: SocketIoConfig = { url: AppSettings.WSURL, options: {} };

@NgModule({
  declarations: [
    StudentComponent, 
    EnrollmentComponent, 
    DashboardEnrollComponent, 
    DashboardComponent, 
    ActionComponent, 
    WeeklyScheduleComponent, 
    PersonalInformationComponent, 
    AcademicConditionsComponent, 
    AccountStatusComponent, 
    CourseHistoryComponent, 
    FinalGradesComponent, 
    CourseAssistanceComponent, 
    EnrollComponent, 
    CoursesEnrollmentComponent, 
    SidebarComponent, 
    FooterComponent, 
    MenuCourseComponent, 
    MenuItemsComponent, 
    MenuOtherComponent, 
    NoticeComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    NgxSmartModalModule.forRoot(),
    ToastrModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    DeviceDetectorModule.forRoot(),
    GtagModule.forRoot({ trackingId: 'UA-152516910-5', trackPageviews: false }),
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
    StudentRoutingModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    StudentService,
    IntentionService,
    WebsocketService,
    HttpConfigInterceptor,
    InterceptorService
  ],
})
export class StudentModule { }
