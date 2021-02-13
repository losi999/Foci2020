import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TeamIdType } from '@foci2020/shared/types/common';
import { TeamRequest } from '@foci2020/shared/types/requests';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeamService {

  private _teamDeleted: Subject<TeamIdType> = new Subject();

  get teamDeleted(): Observable<TeamIdType> {
    return this._teamDeleted.asObservable();
  }
  constructor(private httpClient: HttpClient) { }

  createTeam(request: TeamRequest): Observable<unknown> {
    return this.httpClient.post(`${environment.apiUrl}/team/v1/teams`, request);
  }

  getTeam(teamId: TeamIdType): Observable<TeamResponse> {
    return this.httpClient.get<TeamResponse>(`${environment.apiUrl}/team/v1/teams/${teamId}`);
  }

  updateTeam(teamId: TeamIdType, request: TeamRequest): Observable<unknown> {
    return this.httpClient.put(`${environment.apiUrl}/team/v1/teams/${teamId}`, request);
  }

  listTeams(): Observable<TeamResponse[]> {
    return this.httpClient.get<TeamResponse[]>(`${environment.apiUrl}/team/v1/teams`);
  }

  deleteTeam(teamId: TeamIdType): void {
    this.httpClient.delete(`${environment.apiUrl}/team/v1/teams/${teamId}`).subscribe({
      next: () => {
        this._teamDeleted.next(teamId);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
