import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
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
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if(this.form.valid) {
      this.isInProgress = true;
      this.authService.forgotPassword({
        email: this.form.value.email,
      }).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: () => {
          alert('Hibás felhasználónév');
          this.isInProgress = false;
        },
      });
    }
  }
}
