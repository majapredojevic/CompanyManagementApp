
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user.service';


const helper = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject: BehaviorSubject<User | any>;
  public currentUser: Observable<User>;

  constructor(private userService: UserService, private router: Router, private toast: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    // TODO: rebuild user from validated token here to avoid localstorage tampering
    return this.currentUserSubject.value;
  }

  login(link: string, username: string) {

    let userSubscribe$ = this.userService.getAll(link).subscribe({
      next: (res: any) => {

        if (res.user && res.user.name === username) {
          let user = new User();
          user.id = res.id;
          user.employeeId = res.user.employeeId;

          //token decoding
          let decodedToken = helper.decodeToken(res?.user?.token);

          user.name = decodedToken.UserName;
          user.role = decodedToken.role;
          user.status = decodedToken.userStatus;
          user.token = res.accessToken;

          // user = {...res.user} deep copy objekta Object.assign(res.user); plitka kopija

          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.router.navigate(['employees']);

        } else
          this.toast.error("Invalid username entered.");
        userSubscribe$?.unsubscribe();

      },
      error: err => {
        this.toast.error("Error: Unsuccessful login.");
        userSubscribe$?.unsubscribe();

      }
    })
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
