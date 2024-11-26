import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestServiceComponent } from './request-service/request-service.component';

const routes: Routes = [
  {path:"", component:RequestServiceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
