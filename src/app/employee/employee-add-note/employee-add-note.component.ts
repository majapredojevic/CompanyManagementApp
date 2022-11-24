import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/_models/employee';
import { Note } from 'src/app/_models/note';
import { EmployeeService } from 'src/app/_services/employee.service';

@Component({
  selector: 'app-employee-notes-management',
  templateUrl: './employee-add-note.component.html',
  styleUrls: ['./employee-add-note.component.scss', '../../custom-css.scss']
})
export class EmployeeAddNoteComponent implements OnInit, OnDestroy {

  employeeAddNoteForm: FormGroup;
  employee: Employee = new Employee();

  employeeSubscription$!: Subscription;
  paramSubscription$!: Subscription;
  updateSubscription$!: Subscription;

  constructor(private readonly fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {

    this.employeeAddNoteForm = this.fb.group({
      note: new FormControl('', [Validators.required])
    }
    );
  }

  ngOnInit(): void {

    this.paramSubscription$ = this.route.params.subscribe({ next: p => {

      this.employeeSubscription$ = this.employeeService
        .getEmployee(p['id'])
        .subscribe({ next: employee => {
          this.employee = employee;
        },
          error: err => console.log(err)
      });
    }, error: err => console.log("Error: " + err)
   });

  }

  onSubmit() {

    if (this.employeeAddNoteForm.valid) {

      this.employee.note.push(new Note(this.employeeAddNoteForm.value.note));

      this.updateSubscription$ = this.employeeService.updateEmployee(this.route.snapshot.params['id'], this.employee).subscribe(
        (response) => {
          this.employee = response;
          this.toastr.success("New note added successfully!");
          this.router.navigate(['employees','details', response.id]);

        }, err => console.log("Error: " + err)
      );
    }
  }

  ngOnDestroy(): void {
    this.paramSubscription$?.unsubscribe();
    this.employeeSubscription$?.unsubscribe();
    this.updateSubscription$?.unsubscribe();

  }

}
