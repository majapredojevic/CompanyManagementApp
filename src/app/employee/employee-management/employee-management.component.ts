import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscribable, Subscription } from 'rxjs';
import { Employee } from 'src/app/_models/employee';
import { EmployeeService } from 'src/app/_services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { Position } from 'src/app/_models/position';


@Component({
  selector: 'employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss', '../../custom-css.scss']
})
export class EmployeeManagementComponent implements OnInit, OnDestroy {

  addNewEmployee = false;
  editEmployee = false;

  employeeManagementForm: FormGroup;
  employee: Employee = new Employee();

  paramSubscription$!: Subscription;
  employeeSubscription$!: Subscription;
  addSubscription$!: Subscription;
  updateSubscription$!: Subscription;

  positions = Object.values(Position);


  constructor(private readonly fb: FormBuilder, private employeeService: EmployeeService,
    private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {

    this.employeeManagementForm = this.fb.group({
      id: new FormControl(this.route.snapshot.paramMap.get('id')),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(25)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(25)]),
      position: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      startDate: new FormControl(new Date(), [Validators.required]),
      note: new FormControl([])
    });
  }

  ngOnInit(): void {
    //add employee
    if (this.route.snapshot.paramMap.get('id') === null) {
      this.addNewEmployee = true;
      this.editEmployee = false;
    }
    //edit employee
    else {
      this.addNewEmployee = false;
      this.editEmployee = true;

      this.paramSubscription$ = this.route.params.subscribe({ next: p => {
        this.employeeSubscription$ = this.employeeService
          .getEmployee(p['id'])
          .subscribe({ next: employee => {
            this.employee = employee;
            this.employeeManagementForm.patchValue(employee);
          },
            error: err => this.toastr.error("Error: Couldn't load employees from database!")
          });
      },
       error: err => this.toastr.error("Error: Coundn't load employee from database!")
    })
    }
  }

  onSubmit() {

    if (this.employeeManagementForm.valid) {

      if (this.addNewEmployee) {
        this.addSubscription$ = this.employeeService
          .addEmployee(this.employeeManagementForm.value)
          .subscribe({
            next: response => {
              this.toastr.success("New employee added successfully!");
              this.router.navigate(['employees', 'details', response.id]);
            }, error: err => this.toastr.error("Error while adding new employee.")
      });
      }
      else {
        this.employee = this.employeeManagementForm.value;
        if (this.employee.id) {
          this.updateSubscription$ = this.employeeService.updateEmployee(this.employee.id, this.employeeManagementForm.value)
            .subscribe({ next:response => {
              this.toastr.success("Employee data has been updated successfully.");
              this.router.navigate(['employees', 'details', response.id]);

            }, error: err => this.toastr.error("Error while updating employee data.")
           } );
        }
      }

    }
  }

  ngOnDestroy(): void {
    this.paramSubscription$?.unsubscribe();
    this.employeeSubscription$?.unsubscribe();
    this.addSubscription$?.unsubscribe();
    this.updateSubscription$?.unsubscribe();
  }
}







