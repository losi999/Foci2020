import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest, RegistrationRequest }from '@foci2020/shared/types/requests';
import { LoginResponse }from '@foci2020/shared/types/responses';
import { default as jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  get indexRedirect(): string {
    if(this.isPlayer) {
      return '/';
    }
    if(this.isAdmin) {
      return '/admin';
    }
    if(!this.isLoggedIn) {
      return '/login';
    }
  }

  get isLoggedIn(): boolean {
    return !!this.idToken;
  }

  get idToken(): string {
    return localStorage.getItem('idToken');
  }

  get isPlayer(): boolean {
    console.log(this.isLoggedIn, this.idToken);
    return this.isLoggedIn && jwtDecode(this.idToken)['cognito:groups'].includes('player');
  }

  get isAdmin(): boolean {
    return this.isLoggedIn && jwtDecode(this.idToken)['cognito:groups'].includes('admin');
  }

  public login (request: LoginRequest): Observable<void> {
    this.httpClient.post<LoginResponse>(`${environment.apiUrl}/user/v1/login`, request).subscribe({
      next: (data) => {
        console.log(data);
        localStorage.setItem('idToken', data.idToken);
      },
      error: (error) => {
        console.log(error);
      },
    });

    return undefined;
  }

  public registration (request: RegistrationRequest): Observable<void> {
    this.httpClient.post(`${environment.apiUrl}/user/v1/registration`, request).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });

    return undefined;
  }

  public logout() {
    localStorage.removeItem('idToken');
  }
}
