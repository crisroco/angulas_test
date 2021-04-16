import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DisponiblesComponent } from './dashboard/disponibles/disponibles.component';
import { MatriculadosComponent } from './dashboard/matriculados/matriculados.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
	{ path: '', redirectTo: '/admin/login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'dashboard', component: AdminComponent, 
		children: [
			{
				path: '',
				component: DashboardComponent,
				children: [
					{ path: '', redirectTo: 'disponibles', pathMatch: 'full' },
					{
						path: 'disponibles',
						component: DisponiblesComponent
					},
					{
						path: 'matriculados',
						component: MatriculadosComponent
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
export class AdminRoutingModule { }
