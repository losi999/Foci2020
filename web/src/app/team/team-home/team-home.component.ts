import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { Subscription } from 'rxjs';
import { TeamService } from 'src/app/team/team.service';

@Component({
  selector: 'app-team-home',
  templateUrl: './team-home.component.html',
  styleUrls: ['./team-home.component.scss'],
})
export class TeamHomeComponent implements OnInit, OnDestroy {
  teams: TeamResponse[] ;
  private teamDeletedSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private teamService: TeamService) {
  }

  ngOnDestroy(): void {
    this.teamDeletedSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.teams = this.activatedRoute.snapshot.data.teams;

    this.teamDeletedSubscription = this.teamService.teamDeleted.subscribe({
      next: (teamId) => {
        this.teams = this.teams.filter(t => t.teamId !== teamId);
      },
    });
  }
}
