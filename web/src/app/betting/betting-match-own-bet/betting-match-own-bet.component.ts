import { Component, Input, OnInit } from '@angular/core';
import { BetResponse, MatchResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-betting-match-own-bet',
  templateUrl: './betting-match-own-bet.component.html',
  styleUrls: ['./betting-match-own-bet.component.scss'],
})
export class BettingMatchOwnBetComponent implements OnInit {
  @Input() match: MatchResponse;
  @Input() bet: BetResponse;

  constructor() { }

  ngOnInit(): void {
  }

}
