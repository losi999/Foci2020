import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { TournamentService } from 'src/app/tournament/tournament.service';

@Injectable({
  providedIn: 'root',
})
export class TournamentListResolver implements Resolve<TournamentResponse[]> {
  constructor(private tournamentSevice: TournamentService) {}

  resolve(): Observable<TournamentResponse[]> {
    return this.tournamentSevice.listTournaments();
  }
}
