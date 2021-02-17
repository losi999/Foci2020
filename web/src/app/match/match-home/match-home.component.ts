import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { Subscription } from 'rxjs';
import { MatchService } from 'src/app/match/match.service';

@Component({
  selector: 'app-match-home',
  templateUrl: './match-home.component.html',
  styleUrls: ['./match-home.component.scss'],
})
export class MatchHomeComponent implements OnInit {
  matches: MatchResponse[] ;
  private matchDeletedSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private matchService: MatchService) {
  }

  ngOnDestroy(): void {
    this.matchDeletedSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.matches = this.activatedRoute.snapshot.data.matches;

    this.matchDeletedSubscription = this.matchService.matchDeleted.subscribe({
      next: (matchId) => {
        this.matches = this.matches.filter(t => t.matchId !== matchId);
      },
    });
  }
}
