import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { Subscription } from 'rxjs';
import { TournamentService } from 'src/app/tournament/tournament.service';

@Component({
  selector: 'app-tournament-home',
  templateUrl: './tournament-home.component.html',
  styleUrls: ['./tournament-home.component.scss'],
})
export class TournamentHomeComponent implements OnInit, OnDestroy {
  tournaments: TournamentResponse[] ;
  private tournamentDeletedSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private tournamentService: TournamentService) {
  }

  ngOnDestroy(): void {
    this.tournamentDeletedSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.tournaments = this.activatedRoute.snapshot.data.tournaments;

    this.tournamentDeletedSubscription = this.tournamentService.tournamentDeleted.subscribe({
      next: (tournamentId) => {
        this.tournaments = this.tournaments.filter(t => t.tournamentId !== tournamentId);
      },
    });
  }
}
