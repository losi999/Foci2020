import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { BettingService } from 'src/app/betting/betting.service';

@Injectable({
  providedIn: 'root',
})
export class BettingMatchListResolver implements Resolve<MatchResponse[]> {
  constructor(private bettingService: BettingService) { }

  resolve(): Observable<MatchResponse[]> {
    return this.bettingService.listMatchesOfTournament('cc1797bf-6545-407e-982a-42fe2378b434');
  }
}
