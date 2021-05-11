import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatchResponse, BetResponse, StandingResponse, CompareResponse }from '@foci2020/shared/types/responses';
import { BetRequest } from '@foci2020/shared/types/requests';
import { TournamentId } from '@foci2020/shared/types/common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BettingService {

  constructor(private httpClient: HttpClient) { }

  get defaultTournamentId(): Observable<string> {
    const storedTournamentId = localStorage.getItem('defaultTournamentId');
    if(!storedTournamentId) {
      return this.getDefaultTournamentId().pipe(
        map(({ tournamentId }) => {
          localStorage.setItem('defaultTournamentId', tournamentId);
          return tournamentId;
        })
      );
    }
    return of(storedTournamentId);
  }

  getDefaultTournamentId(): Observable<TournamentId> {
    return this.httpClient.get<TournamentId>(`${environment.apiUrl}/setting/v1/settings/defaultTournamentId`);
  }

  listMatchesOfTournament(tournamentId: string): Observable<MatchResponse[]> {
    return this.httpClient.get<MatchResponse[]>(`${environment.apiUrl}/betting/v1/tournaments/${tournamentId}/matches`);
  }

  listStandingsOfTournament(tournamentId: string): Observable<StandingResponse[]> {
    return this.httpClient.get<StandingResponse[]>(`${environment.apiUrl}/betting/v1/tournaments/${tournamentId}/standings`);
  }

  listBetsOfMatch(matchId: string): Observable<BetResponse[]> {
    return this.httpClient.get<BetResponse[]>(`${environment.apiUrl}/betting/v1/matches/${matchId}/bets`);
  }

  placeBet(matchId: string, bet: BetRequest): Observable<unknown> {
    return this.httpClient.post(`${environment.apiUrl}/betting/v1/matches/${matchId}/bets`, bet);
  }

  compare(tournamentId: string, userId: string): Observable<CompareResponse> {
    return this.httpClient.get<CompareResponse>(`${environment.apiUrl}/betting/v1/tournaments/${tournamentId}/compare/${userId}`);
  }
}
