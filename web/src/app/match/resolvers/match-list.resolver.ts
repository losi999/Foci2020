import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { MatchService } from 'src/app/match/match.service';

@Injectable({
  providedIn: 'root',
})
export class MatchListResolver implements Resolve<MatchResponse[]> {
  constructor(private matchService: MatchService) {}

  resolve(): Observable<MatchResponse[]> {
    return this.matchService.listMatches();
  }
}
