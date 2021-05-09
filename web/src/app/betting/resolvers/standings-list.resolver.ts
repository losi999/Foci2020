import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { StandingResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { BettingService } from '../betting.service';

@Injectable({
  providedIn: 'root',
})
export class StandingsListResolver implements Resolve<StandingResponse[]> {
  constructor(private bettingService: BettingService) { }

  resolve(): Observable<StandingResponse[]> {
    return this.bettingService.listStandingsOfTournament('cc1797bf-6545-407e-982a-42fe2378b434');
  }
}
