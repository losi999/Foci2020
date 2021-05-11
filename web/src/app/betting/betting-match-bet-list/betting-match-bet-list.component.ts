import { Component, Input, OnInit } from '@angular/core';
import { BetResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-betting-match-bet-list',
  templateUrl: './betting-match-bet-list.component.html',
  styleUrls: ['./betting-match-bet-list.component.scss'],
})
export class BettingMatchBetListComponent implements OnInit {
  @Input() bets: BetResponse[];
  constructor() { }

  ngOnInit(): void {
  }

}
