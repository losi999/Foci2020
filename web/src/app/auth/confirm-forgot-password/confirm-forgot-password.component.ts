import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-confirm-forgot-password',
  templateUrl: './confirm-forgot-password.component.html',
  styleUrls: ['./confirm-forgot-password.component.scss'],
})
export class ConfirmForgotPasswordComponent implements OnInit {
  form: FormGroup;
  isInProgress: boolean;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

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
      confirmationCode: new FormControl({
        disabled: true,
        value: this.route.snapshot.queryParamMap.get('confirmationCode'),
      }, Validators.required),
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    console.log(this.form);
    if(this.form.valid) {
      this.isInProgress = true;
      this.authService.confirmForgotPassword({
        email: this.form.value.email,
        password: this.form.value.password,
        confirmationCode: this.route.snapshot.queryParamMap.get('confirmationCode'),
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
