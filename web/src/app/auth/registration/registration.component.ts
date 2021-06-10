import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  isInProgress: boolean;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isInProgress = false;
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
    console.log(this.form);
    if(this.form.valid) {
      this.isInProgress = true;
      this.authService.registration({
        email: this.form.value.email,
        password: this.form.value.password,
        displayName: this.form.value.displayName,
      }).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log(error);
          alert('Felhasználónév foglalt');
          this.isInProgress = false;
        },
      });
    }
  }

}
