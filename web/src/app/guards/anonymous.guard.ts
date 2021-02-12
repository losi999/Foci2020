import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AnonymousGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.authService.isLoggedIn) {
      return true;
    }

    if(this.authService.isAdmin) {
      this.router.navigate(['/admin']);
      return false;
    }

    if(this.authService.isPlayer) {
      this.router.navigate(['/']);
      return false;
    }

  }

}
