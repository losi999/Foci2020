import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TournamentIdType } from '@foci2020/shared/types/common';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  private _tournamentDeleted: Subject<TournamentIdType> = new Subject();
  private _defaultTournamentChanged: Subject<TournamentIdType> = new Subject();

  get defaultTournamentId(): string {
    return localStorage.getItem('defaultTournamentId');
  }

  get tournamentDeleted(): Observable<TournamentIdType> {
    return this._tournamentDeleted.asObservable();
  }

  get defaultTournamentChanged(): Observable<TournamentIdType> {
    return this._defaultTournamentChanged.asObservable();
  }

  constructor(private httpClient: HttpClient) { }

  createTournament(request: TournamentRequest): Observable<unknown> {
    return this.httpClient.post(`${environment.apiUrl}/tournament/v1/tournaments`, request);
  }

  getTournament(tournamentId: TournamentIdType): Observable<TournamentResponse> {
    return this.httpClient.get<TournamentResponse>(`${environment.apiUrl}/tournament/v1/tournaments/${tournamentId}`);
  }

  updateTournament(tournamentId: TournamentIdType, request: TournamentRequest): Observable<unknown> {
    return this.httpClient.put(`${environment.apiUrl}/tournament/v1/tournaments/${tournamentId}`, request);
  }

  listTournaments(): Observable<TournamentResponse[]> {
    return this.httpClient.get<TournamentResponse[]>(`${environment.apiUrl}/tournament/v1/tournaments`);
  }

  deleteTournament(tournamentId: TournamentIdType): void {
    this.httpClient.delete(`${environment.apiUrl}/tournament/v1/tournaments/${tournamentId}`).subscribe({
      next: () => {
        this._tournamentDeleted.next(tournamentId);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  setDefaultTournament(tournamentId: TournamentIdType): void {
    this.httpClient.post(`${environment.apiUrl}/setting/v1/settings/defaultTournament`, {
      tournamentId,
    }).subscribe({
      next: () => {
        this._defaultTournamentChanged.next(tournamentId);
      },
    });
  }
}
