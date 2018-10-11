import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserFacade } from '../../core/auth-fire/auth-fire.facade';
import { User } from '../../core/auth-fire/auth-fire.model';

@Component({
  selector: 'amds-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  registerForm: FormGroup;
  hidePass = true;

  // Observable User Facade property
  user$: Observable<User> = this.userService.user$;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserFacade
  ) {}

  ngOnInit() {
    // Register Form Field configuration and validators
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  insertAt() {
    const formEmail = this.registerForm.value.email;
    this.registerForm.patchValue({ email: formEmail + '@' });
  }

  submitHandler() {
    // Sign up with Email Address
    console.log('sign up with Email Address');
    const formData = this.registerForm.value;
    this.userService.signUpEmail(
      formData.email,
      formData.password,
      formData.name
    );
  }

  signUpWithGoogle() {
    console.log('sign up with Google');
    this.userService.loginGoogle();
  }

  signUpWithFacebook() {
    console.log('sign up with Faceebook');
    this.userService.loginFacebook();
  }

  signUpWithTwitter() {
    console.log('sign up with Twitter');
    this.userService.loginTwitter();
  }

  signUpWithGithub() {
    console.log('sign up with Github');
    this.userService.loginGithub();
  }

  goLogin() {
    console.log('Redirect to Login Page');
    this.router.navigate(['account/login']);
  }
}
