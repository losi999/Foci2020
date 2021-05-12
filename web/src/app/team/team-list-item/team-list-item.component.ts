import { Component, Input, OnInit } from '@angular/core';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { TeamService } from 'src/app/team/team.service';

@Component({
  selector: 'app-team-list-item',
  templateUrl: './team-list-item.component.html',
  styleUrls: ['./team-list-item.component.scss'],
})
export class TeamListItemComponent implements OnInit {
  @Input() team: TeamResponse;

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
  }

  onTeamDelete() {
    this.teamService.deleteTeam(this.team.teamId);
  }
}
