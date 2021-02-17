import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { TournamentIdType } from '@foci2020/shared/types/common';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { TournamentService } from 'src/app/tournament/tournament.service';

@Injectable({
  providedIn: 'root',
})
export class TournamentResolver implements Resolve<TournamentResponse> {
  constructor(private tournamentService: TournamentService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TournamentResponse> {
    return this.tournamentService.getTournament(route.paramMap.get('tournamentId') as TournamentIdType);
  }
}
