
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { AuthService } from '../_services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../custom-css.scss']
})
export class LoginComponent {

  link = '';
  loginForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(4)])
    });
  }

  setLink(link: string) {
    this.link = link;
  }

  onSubmit() {
    this.authService.login(this.link, this.loginForm.value.username);
  }

  public setFocus(input: string) {
    const targetElem = document.getElementById(input);
    setTimeout(function waitTargetElem() {
     if (document.body.contains(targetElem)) {
       targetElem?.focus();
     } else {
       setTimeout(waitTargetElem, 100);
     }
   }, 500);
 }

}
