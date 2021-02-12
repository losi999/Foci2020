import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatchResponse }from '@foci2020/shared/types/responses';

@Injectable({
  providedIn: 'root',
})
export class BettingService {

  constructor(private httpClient: HttpClient) { }

  listMatchesOfTournament(tournamentId: string): Observable<MatchResponse[]> {
    return this.httpClient.get<MatchResponse[]>(`${environment.apiUrl}/betting/v1/tournaments/${tournamentId}/matches`);
  }
}
