import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/_models/employee';
import { EmployeeFilter } from 'src/app/_models/employeeFilter';
import { EmployeeService } from 'src/app/_services/employee.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, startWith, Subscription } from 'rxjs';
import { Position } from 'src/app/_models/position';
import { FormBuilder, FormControl } from '@angular/forms';
import { __values } from 'tslib';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss', '../../custom-css.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy, AfterViewInit {

  columnHeadings = ['firstName', 'lastName', 'position', 'startDate'];
  displayNames = ['First Name', 'Last Name', 'Job position', 'Job started date'];

  empFilters: EmployeeFilter[] = [];
  filterData = false;
  searchBoxForm: any;


  defaultValue = "All";
  positions: string[] = [this.defaultValue].concat(Object.values(Position));

  dataSource = new MatTableDataSource<Employee>();

  user = this.authService.currentUserValue.role;

  subscriptionEmployees$!: Subscription;
  subscriptionSearchBox$!: Subscription;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  router: any;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

  }

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toast: ToastrService,
    private readonly fb: FormBuilder
  ) {

    this.searchBoxForm = this.fb.group({
      search: new FormControl(''),
      selectedFilterOption: new FormControl('All')
    });

    this.dataSource.filterPredicate = ((data, filter) => {
      const a = filter.selectedFilterOption === 'All' || data.position === filter.selectedFilterOption;
      const b = !filter.search || data.firstName.toLowerCase().includes(filter.search) || data.lastName.toLowerCase().includes(filter.search);
      return a && b;
    }) as (Employee: any, string: any) => boolean;
  }

  ngOnInit() {

    //get all employees
    this.subscriptionEmployees$ = this.employeeService.getEmployees().subscribe({
      next: res => {
        this.dataSource.data = res;
      },
      error: err => {
        this.toast.error("Error: Couldn't load employees from database!");
      }
    });

    this.empFilters.push({ name: 'position', options: this.positions, defaultValue: this.defaultValue });

    this.subscriptionSearchBox$ = this.searchBoxForm.valueChanges.pipe(startWith(""),
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((value: any) => {
      if (value) {
        const filter = { ...value, search: value.search.trim().toLowerCase() } as string;
        this.dataSource.filter = filter;
      }
    });
  }

  ngOnDestroy() {
    this.subscriptionEmployees$?.unsubscribe();
    this.subscriptionSearchBox$?.unsubscribe();
  }

}
