import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'amds-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  loginForm: FormGroup;
  hidePass = true;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    // Login Form Field configuration and validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  insertAt() {
    const formEmail = this.loginForm.value.email;
    this.loginForm.patchValue({ email: formEmail + '@' });
  }

  signInWithGoogle() {
    console.log('sign in with Google');
  }

  submitHandler() {
    console.log('sign in with Email Address');
  }

  resetPassword() {
    console.log('reset password');
  }
}
