import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private toast: ToastrService
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;

    switch (true) {
      case currentUser?.status === 'Active' && route.data['role'][0] === currentUser?.role: //admin
        return true;
      case currentUser?.status === 'Active' && route.data['role'][1] === currentUser?.role && route.params['id'] === currentUser?.employeeId: //user can see only details about him
        return true;
      case currentUser?.status === 'Active' && route.data['role'][1] === currentUser?.role && route.params['id'] === undefined: //user can se all employees
        return true;
      default:
        {

          this.toast.error("Access denied!");
          this.authenticationService.logout();
          this.router.navigate(['/login']);
          return false;
        }

    }
  }
}
