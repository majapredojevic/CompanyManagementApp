import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss', '../../../custom-css.scss']
})
export class NavBarComponent implements OnInit {
  currentUser;

  constructor(public authService: AuthService) {
    this.currentUser = this.authService.currentUserValue;
  }


  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
  }
}



