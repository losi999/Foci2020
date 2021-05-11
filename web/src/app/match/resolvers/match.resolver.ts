import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { MatchIdType } from '@foci2020/shared/types/common';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { MatchService } from 'src/app/match/match.service';

@Injectable({
  providedIn: 'root',
})
export class MatchResolver implements Resolve<MatchResponse> {
  constructor(private matchService: MatchService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MatchResponse> {
    return this.matchService.getMatch(route.paramMap.get('matchId') as MatchIdType);
  }
}
