import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
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
    public snackBar: MatSnackBar,
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

  signInWithGoogle() {
    console.log('sign in Google attempt');
    this.userService.loginGoogle();
  }

  submitHandler() {
    console.log('sign in Email attempt');
    const formData = this.loginForm.value;
    this.userService.loginEmail(formData.email, formData.password);
  }

  resetPassword() {
    console.log('reset password');
    this.router.navigate(['account/reset']);
  }

  goRegister() {
    console.log('Redirect to Register Page');
    this.router.navigate(['account/register']);
  }

  private notifyUser(message: string, action?: string) {
    // Snackbar notications and actions
    if (message === 'The user does not exist') {
      return this.snackBar
        .open(message, 'Sign Up', {
          duration: 4000,
          panelClass: 'login-notify-overlay'
        })
        .onAction()
        .subscribe(() => this.goRegister());
    }

    if (message === 'Invalid password. Try again') {
      return this.snackBar
        .open(message, 'Reset Password', {
          duration: 4000,
          panelClass: 'login-notify-overlay'
        })
        .onAction()
        .subscribe(() => this.resetPassword());
    }

    if (message === 'The Account is disabled') {
      return this.snackBar
        .open(message, 'Contact Administrator', {
          duration: 4000,
          panelClass: 'login-notify-overlay'
        })
        .onAction()
        .subscribe(() => this.resetPassword());
    } else {
      return this.snackBar.open(message, action, {
        duration: 3500,
        panelClass: 'login-notify-overlay'
      });
    }
  }
}
