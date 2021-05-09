import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isInProgress: boolean;
  constructor(private authService: AuthService) { }

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
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if(this.form.valid) {
      this.isInProgress = true;
      this.authService.login({
        email: this.form.value.email,
        password: this.form.value.password,
      }).subscribe({
        error: (error) => {
          console.log(error);
          alert('¯\\_(ツ)_/¯');
          this.isInProgress = false;
        },
      });
    }
  }
}
