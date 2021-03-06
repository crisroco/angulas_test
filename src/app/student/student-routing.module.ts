import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActionComponent } from './pages/action/action.component';
import { WeeklyScheduleComponent } from './pages/action/weekly-schedule/weekly-schedule.component';
import { PersonalInformationComponent } from './pages/action/personal-information/personal-information.component';
import { AccountStatusComponent } from './pages/action/account-status/account-status.component';
import { AcademicConditionsComponent } from './pages/action/academic-conditions/academic-conditions.component';
import { CourseHistoryComponent } from './pages/action/course-history/course-history.component';
import { FinalGradesComponent } from './pages/action/final-grades/final-grades.component';
import { CourseAssistanceComponent } from './pages/action/course-assistance/course-assistance.component';
import { ChargeFormComponent } from './pages/action/charge-form/charge-form.component';
import { EnrollComponent } from './pages/action/enroll/enroll.component';
import { StudentComponent } from './student.component';

import { EnrollmentComponent } from './pages/enrollment/enrollment.component';
import { DashboardEnrollComponent } from './pages/enrollment/dashboard-enroll/dashboard-enroll.component';
import { CoursesEnrollmentComponent } from './pages/enrollment/courses-enrollment/courses-enrollment.component';

const routes: Routes = [
	{
		path: '',
		component: StudentComponent,
		children: [
			{
				path:'',
				redirectTo: 'inicio',
				pathMatch: 'full'
			},
			{
				path: 'inicio',
				component: DashboardComponent
			},
			{
				path: 'accion',
				component: ActionComponent,
				children: [
					{
						path: 'horario',
						component: WeeklyScheduleComponent
					},
					{
						path: 'datos-personales',
						component: PersonalInformationComponent
					},
					{
						path: 'estado-cuenta',
						component: AccountStatusComponent
					},
					{
						path: 'condiciones-academicas',
						component: AcademicConditionsComponent
					},
					{
						path: 'historial-cursos',
						component: CourseHistoryComponent
					},
					{
						path: 'notas-finales/:parts',
						component: FinalGradesComponent
					},
					{
						path: 'asistencia/:parts',
						component: CourseAssistanceComponent
					},
					{
						path: 'matricula',
						component: EnrollComponent
					},
					{
						path: 'cargo',
						component: ChargeFormComponent
					}
				]
			},
			{
				path: 'matricula',
				component: EnrollmentComponent,
				children: [
					{ path: '', redirectTo: '/disponibles', pathMatch: 'full' },
					{
						path: 'disponibles',
						component: DashboardEnrollComponent
					},
					{
						path: 'cursos-elegidos',
						component: CoursesEnrollmentComponent
					}
				]
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
