import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserFacade } from '../../core/auth-fire/auth-fire.facade';
import { User } from '../../core/auth-fire/auth-fire.model';

@Component({
  selector: 'amds-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  loginForm: FormGroup;
  hidePass = true;

  // Observable User Facade property
  user$: Observable<User> = this.userService.user$;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserFacade
  ) {}

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

  submitHandler() {
    // Sign in with Email Address
    console.log('sign in Email attempt');
    const formData = this.loginForm.value;
    this.userService.loginEmail(formData.email, formData.password);
  }

  signInWithGoogle() {
    console.log('sign in Google attempt');
    this.userService.loginGoogle();
  }

  signInWithFacebook() {
    console.log('sign in Facebook attempt');
    this.userService.loginFacebook();
  }

  signInWithTwitter() {
    console.log('sign in Twitter attempt');
    this.userService.loginTwitter();
  }

  signInWithGithub() {
    console.log('sign in Github attempt');
    this.userService.loginGithub();
  }

  resetPassword() {
    console.log('reset password');
    this.router.navigate(['account/reset']);
  }

  goRegister() {
    console.log('Redirect to Register Page');
    this.router.navigate(['account/register']);
  }
}
