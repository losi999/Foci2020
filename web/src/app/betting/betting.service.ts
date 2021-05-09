import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatchResponse, BetResponse, StandingResponse }from '@foci2020/shared/types/responses';
import { BetRequest } from '@foci2020/shared/types/requests';

@Injectable({
  providedIn: 'root',
})
export class BettingService {

  constructor(private httpClient: HttpClient) { }

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
}
