import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    if(!this.authService.isAdmin) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
