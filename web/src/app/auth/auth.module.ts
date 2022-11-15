import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmForgotPasswordComponent } from './confirm-forgot-password/confirm-forgot-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    ConfirmForgotPasswordComponent,
  ],
  imports: [
    RouterModule.forChild([]),
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [LoginComponent],
})
export class AuthModule { }
