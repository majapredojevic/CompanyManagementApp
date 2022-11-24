import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscribable, Subscription } from 'rxjs';
import { Employee } from 'src/app/_models/employee';
import { AuthService } from 'src/app/_services/auth.service';
import { EmployeeService } from 'src/app/_services/employee.service';


@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss', '../../custom-css.scss']
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('dialogRef')
  dialogRef!: TemplateRef<any>;

  user;
  panelOpenState = false;
  employee: Employee = new Employee();
  addNewNote = false;

  employeeId!: string;

  // asyncBla!: Subscribable<Employee>;

  paramSubscription$!: Subscription;
  employeeSubscription$!: Subscription;
  deleteSubscription$!: Subscription;


  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.user = this.authService.currentUserValue;
  }

  openDialog() {
    this.dialog.open(this.dialogRef, {});
  }

  delete() {

    this.employeeSubscription$ = this.employeeService.deleteEmployee(this.employeeId).subscribe({
      next:res=>{

        this.toastr.success("Deleted sucessfully!");
        this.router.navigate(['employees']);
      },
      error:err=>{
        this.toastr.error("Error: Employee isn't deleted successfully");
      }
    });
     // this.asyncBla = this.employeeService.getEmployee(p['id']);
  }

  ngOnInit() {

    this.paramSubscription$ = this.route.params.subscribe(p => {
      this.employeeId = p['id'];
      this.employeeSubscription$ = this.employeeService.getEmployee(p['id']).subscribe({
        next:res=>{
          this.employee = {...res};
        },
        error:err=>{
          this.toastr.error("Error: Couldn't load employees from database!");
        }
      });
       // this.asyncBla = this.employeeService.getEmployee(p['id']);
    });


  }

  ngOnDestroy() {

    this.paramSubscription$?.unsubscribe();
    this.employeeSubscription$?.unsubscribe();
    this.deleteSubscription$?.unsubscribe();
  }

}
