import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

    getAll(roleUrl: string) {
        return this.http.get<User[]>(`${environment.apiUrl}${roleUrl}`);
    }

    // getById(roleUrl :string, id: string) {
    //     return this.http.get<User>(`${environment.apiUrl}${roleUrl}/${id}`);
    // }
}
