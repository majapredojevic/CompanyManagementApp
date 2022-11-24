import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../_models/employee';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  empoyeeUrl = `${environment.apiUrl}/employees`;
  employee: Employee[] = [];


  constructor(private http: HttpClient) { }

  // GET - get all employees
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.empoyeeUrl);
  }

  // GET - get a single employee using id
  getEmployee(id: string): Observable<Employee> {
    const url = `${this.empoyeeUrl}/${id}`
    return this.http.get<Employee>(url);
  }

  // POST - add a new employee
  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.empoyeeUrl, employee, httpOptions);
  }

  // PUT - update an employee
  updateEmployee(id: string, update: Employee): Observable<Employee> {
    const url = `${this.empoyeeUrl}/${id}`;
    return this.http.put<Employee>(url, update, httpOptions);
  }

  // DELETE - delete an employee
  deleteEmployee(id: string): Observable<{}> {
    const url = `${this.empoyeeUrl}/${id}`;
    return this.http.delete(url, httpOptions);
  }


}



