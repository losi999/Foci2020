import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { TeamService } from 'src/app/team/team.service';

@Injectable({
  providedIn: 'root',
})
export class TeamListResolver implements Resolve<TeamResponse[]> {
  constructor(private teamSevice: TeamService) {}

  resolve(): Observable<TeamResponse[]> {
    return this.teamSevice.listTeams();
  }
}
