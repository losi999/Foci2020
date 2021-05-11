import { Component, Input, OnInit } from '@angular/core';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { MatchService } from 'src/app/match/match.service';

@Component({
  selector: 'app-match-list-item',
  templateUrl: './match-list-item.component.html',
  styleUrls: ['./match-list-item.component.scss'],
})
export class MatchListItemComponent implements OnInit {
  @Input() match: MatchResponse;

  constructor(private matchService: MatchService) { }

  ngOnInit(): void {
  }

  onMatchDelete() {
    this.matchService.deleteMatch(this.match.matchId);
  }
}
