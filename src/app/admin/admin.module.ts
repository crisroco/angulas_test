import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { NgxLoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DisponiblesComponent } from './dashboard/disponibles/disponibles.component';
import { MatriculadosComponent } from './dashboard/matriculados/matriculados.component';
import { TooltipModule, TooltipOptions } from '@teamhive/ngx-tooltip';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  declarations: [AdminComponent, LoginComponent, DashboardComponent, DisponiblesComponent, MatriculadosComponent],
  imports: [
    FormsModule,
  	ReactiveFormsModule,
    CommonModule,
    ToastrModule.forRoot(),
    AdminRoutingModule,
    NgxSmartModalModule.forRoot(),
    NgxLoadingModule.forRoot({}),
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
    })
  ]
})
export class AdminModule { }
