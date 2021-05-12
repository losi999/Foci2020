import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest, RefreshTokenRequest, RegistrationRequest }from '@foci2020/shared/types/requests';
import { IdTokenResponse, LoginResponse }from '@foci2020/shared/types/responses';
import { default as jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

type TokenClaims = {
  sub: string;
  'cognito:groups': string[];
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private httpClient: HttpClient, private router: Router) { }

  private static decodeToken(token: string) {
    return jwtDecode<TokenClaims>(token);
  }

  redirect(): void {
    if(this.isPlayer) {
      this.router.navigate(['/']);
    }
    if(this.isAdmin) {
      this.router.navigate(['/admin']);
    }
    if(!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  get isLoggedIn(): boolean {
    return !!this.idToken;
  }

  get idToken(): string {
    return localStorage.getItem('idToken');
  }

  get isPlayer(): boolean {
    return this.isLoggedIn && AuthService.decodeToken(this.idToken)['cognito:groups'].includes('player');
  }

  get isAdmin(): boolean {
    return this.isLoggedIn && AuthService.decodeToken(this.idToken)['cognito:groups'].includes('admin');
  }

  get userId(): string {
    return AuthService.decodeToken(this.idToken).sub;
  }

  public login (request: LoginRequest): Observable<unknown> {
    return this.httpClient.post<LoginResponse>(`${environment.apiUrl}/user/v1/login`, request).pipe(
      map((data) => {
        localStorage.setItem('idToken', data.idToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        this.redirect();
      }),
    );
  }

  public registration (request: RegistrationRequest): Observable<unknown> {
    return this.httpClient.post(`${environment.apiUrl}/user/v1/registration`, request);
  }

  public refreshToken(): Observable<unknown> {
    const request: RefreshTokenRequest = {
      refreshToken: localStorage.getItem('refreshToken'),
    };
    return this.httpClient.post<IdTokenResponse>(`${environment.apiUrl}/user/v1/refreshToken`, request).pipe(map((data) => {
      localStorage.setItem('idToken', data.idToken);
    }));
  }

  public logout() {
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    this.redirect();
  }
}
