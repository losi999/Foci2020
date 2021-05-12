import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { CompareResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BettingService } from '../betting.service';

@Injectable({
  providedIn: 'root',
})
export class CompareResolver implements Resolve<CompareResponse> {
  constructor(private bettingService: BettingService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<CompareResponse> {
    const userId = route.paramMap.get('userId');

    return this.bettingService.defaultTournamentId.pipe(
      mergeMap((tournamentId) => {
        return this.bettingService.compare(tournamentId, userId);
      })
    );
  }
}
