import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { TeamIdType } from '@foci2020/shared/types/common';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { Observable } from 'rxjs';
import { TeamService } from 'src/app/team/team.service';

@Injectable({
  providedIn: 'root',
})
export class TeamResolver implements Resolve<TeamResponse> {
  constructor(private teamService: TeamService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TeamResponse> {
    return this.teamService.getTeam(route.paramMap.get('teamId') as TeamIdType);
  }
}
