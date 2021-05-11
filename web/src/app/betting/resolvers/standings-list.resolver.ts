import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { StandingResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BettingService } from '../betting.service';

@Injectable({
  providedIn: 'root',
})
export class StandingsListResolver implements Resolve<StandingResponse[]> {
  constructor(private bettingService: BettingService) { }

  resolve(): Observable<StandingResponse[]> {
    return this.bettingService.defaultTournamentId.pipe(
      mergeMap((tournamentId) => {
        return this.bettingService.listStandingsOfTournament(tournamentId);
      })
    );
  }
}
