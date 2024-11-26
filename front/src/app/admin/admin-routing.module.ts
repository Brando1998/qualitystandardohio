import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ServicesListComponent } from './services-list/services-list.component';
import { authGuard } from '../guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "dash", component: DashboardComponent, children: [
      { path: "services-list", component: ServicesListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
