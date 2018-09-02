import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'amds-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  registerForm: FormGroup;
  hidePass = true;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    // Register Form Field configuration and validators
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  insertAt() {
    const formEmail = this.registerForm.value.email;
    this.registerForm.patchValue({ email: formEmail + '@' });
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
