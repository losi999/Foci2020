import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BettingService } from 'src/app/betting/betting.service';

@Injectable({
  providedIn: 'root',
})
export class BettingMatchListResolver implements Resolve<MatchResponse[]> {
  constructor(private bettingService: BettingService) { }

  resolve(): Observable<MatchResponse[]> {
    return this.bettingService.defaultTournamentId.pipe(
      mergeMap((tournamentId) => {
        return this.bettingService.listMatchesOfTournament(tournamentId);
      })
    );
  }
}
