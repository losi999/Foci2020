import { Component, Input, OnInit } from '@angular/core';
import { MatchResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-betting-match-list-day-item',
  templateUrl: './betting-match-list-day-item.component.html',
  styleUrls: ['./betting-match-list-day-item.component.scss'],
})
export class BettingMatchListDayItemComponent implements OnInit {
  @Input() day: string;
  @Input() matches: MatchResponse[];

  constructor() { }

  ngOnInit(): void {
  }

}
