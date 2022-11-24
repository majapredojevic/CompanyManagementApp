import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { EmployeeAddNoteComponent } from './employee-add-note/employee-add-note.component';
import { AuthGuard } from './../_helpers/auth.guard';
import { Role } from '../_models/role';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: '', component: EmployeeListComponent,
        canActivate: [AuthGuard],
        data: { role: [Role.Admin, Role.User] }
    },

      {
        path: 'details/:id',
        component: EmployeeDetailsComponent,
        canActivate: [AuthGuard],
        data: { role: [Role.Admin, Role.User] }
      },
      {
        path: 'add',
        component: EmployeeManagementComponent,
        canActivate: [AuthGuard],
        data: { role: [Role.Admin] }
      },
      {
        path: 'edit/:id',
        component: EmployeeManagementComponent,
        canActivate: [AuthGuard],
        data: { role: [Role.Admin] }
      },
      {
        path: 'note/add/:id',
        component: EmployeeAddNoteComponent,
        canActivate: [AuthGuard],
        data: { role: [Role.Admin] }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
