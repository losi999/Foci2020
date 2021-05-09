import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-betting-home',
  templateUrl: './betting-home.component.html',
  styleUrls: ['./betting-home.component.scss'],
})
export class BettingHomeComponent implements OnInit {
  matches: {
    [date: string]: MatchResponse[]
  };
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.matches = (this.activatedRoute.snapshot.data.matchList as MatchResponse[]).reduce<{
      [date: string]: MatchResponse[]
    }>((accumulator, currentValue) => {
      const date = new Date(currentValue.startTime.split('T')[0]).toISOString();
      if(!accumulator[date]) {
        accumulator[date] = [];
      }

      accumulator[date].push(currentValue);

      return accumulator;
    }, {});
  }

}
