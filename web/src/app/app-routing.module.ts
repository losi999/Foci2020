import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RegistrationComponent } from 'src/app/auth/registration/registration.component';
import { AdminGuard } from 'src/app/guards/admin.guard';
import { AnonymousGuard } from 'src/app/guards/anonymous.guard';
import { PlayerGuard } from 'src/app/guards/player.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AnonymousGuard],
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [AnonymousGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AdminGuard],
  },
  {
    path: '',
    loadChildren: () => import('./betting/betting.module').then(m => m.BettingModule),
    canLoad: [PlayerGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
