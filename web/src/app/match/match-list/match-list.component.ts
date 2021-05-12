import { Component, Input, OnInit } from '@angular/core';
import { MatchResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
})
export class MatchListComponent implements OnInit {
  @Input() matches: MatchResponse[];

  constructor() { }

  ngOnInit(): void {
  }

}
