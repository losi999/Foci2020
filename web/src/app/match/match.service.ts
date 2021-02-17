import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatchIdType } from '@foci2020/shared/types/common';
import { MatchRequest } from '@foci2020/shared/types/requests';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MatchService {

  private _matchDeleted: Subject<MatchIdType> = new Subject();

  get matchDeleted(): Observable<MatchIdType> {
    return this._matchDeleted.asObservable();
  }
  constructor(private httpClient: HttpClient) { }

  createMatch(request: MatchRequest): Observable<unknown> {
    return this.httpClient.post(`${environment.apiUrl}/match/v1/matches`, request);
  }

  getMatch(matchId: MatchIdType): Observable<MatchResponse> {
    return this.httpClient.get<MatchResponse>(`${environment.apiUrl}/match/v1/matches/${matchId}`);
  }

  updateMatch(matchId: MatchIdType, request: MatchRequest): Observable<unknown> {
    return this.httpClient.put(`${environment.apiUrl}/match/v1/matches/${matchId}`, request);
  }

  listMatches(): Observable<MatchResponse[]> {
    return this.httpClient.get<MatchResponse[]>(`${environment.apiUrl}/match/v1/matches`);
  }

  deleteMatch(matchId: MatchIdType): void {
    this.httpClient.delete(`${environment.apiUrl}/match/v1/matches/${matchId}`).subscribe({
      next: () => {
        this._matchDeleted.next(matchId);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
