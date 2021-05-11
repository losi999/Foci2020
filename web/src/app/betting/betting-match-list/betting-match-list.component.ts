import { Component, Input, OnInit } from '@angular/core';
import { MatchResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-betting-match-list',
  templateUrl: './betting-match-list.component.html',
  styleUrls: ['./betting-match-list.component.scss'],
})
export class BettingMatchListComponent implements OnInit {
  @Input() matches: {
    [date: string]: MatchResponse[];
  };

  constructor() { }

  ngOnInit(): void {
  }

}
