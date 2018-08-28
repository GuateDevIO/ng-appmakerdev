import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    LoginComponent,
    RegisterComponent,
    WelcomeComponent,
    ResetPasswordComponent
  ]
})
export class AccountModule {}
