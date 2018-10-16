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
    // Helper to insert '@' to the email field ***KEEP?
    const formEmail = this.registerForm.value.email;
    this.registerForm.patchValue({ email: formEmail + '@' });
  }

  submitHandler() {
    // Sign up with Email Address + include user name
    console.log('submitHandler() > Sign up Email attempt');
    const formData = this.registerForm.value;
    this.userService.signUpEmail(
      formData.email,
      formData.password,
      formData.name
    );
  }

  signUpWithGoogle() {
    // Sign up with Google account
    console.log('signUpWithGoogle() attempt');
    this.userService.loginGoogle();
  }

  signUpWithFacebook() {
    // Sign up with Faceebook account
    console.log('signUpWithFacebook() attempt');
    this.userService.loginFacebook();
  }

  signUpWithTwitter() {
    // Sign up with Twitter account
    console.log('signUpWithTwitter() attempt');
    this.userService.loginTwitter();
  }

  signUpWithGithub() {
    // Sign up with Github account
    console.log('signUpWithGithub() attempt');
    this.userService.loginGithub();
  }

  goLogin() {
    // Redirect user > account/login
    console.log('goLogin() > account/login ');
    this.router.navigate(['account/login']);
  }
}
