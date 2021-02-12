import { Component, Input, OnInit } from '@angular/core';
import { MatchResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-betting-match-list-match-item',
  templateUrl: './betting-match-list-match-item.component.html',
  styleUrls: ['./betting-match-list-match-item.component.scss'],
})
export class BettingMatchListMatchItemComponent implements OnInit {
  @Input() match: MatchResponse;

  constructor() { }

  ngOnInit(): void {
  }

}
