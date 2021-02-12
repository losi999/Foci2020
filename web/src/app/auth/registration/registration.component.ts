import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

const passwordMatchValidator = (form) => {
  const password = form.value.password;
  const passwordConfirm = form.value.passwordConfirm;

  if (!password || !passwordConfirm || password === passwordConfirm) {
    return null;
  }

  return {
    passwordsNotMatch: true,
  };
};

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  form: FormGroup;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      passwordConfirm: new FormControl(null, [Validators.required]),
      displayName: new FormControl(null, [Validators.required]),
    }, {
      validators: [passwordMatchValidator],
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if(this.form.valid) {
      this.authService.registration({
        email: this.form.value.email,
        password: this.form.value.password,
        displayName: this.form.value.displayName,
      });
    }
  }

}
