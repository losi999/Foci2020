import { Component, Input, OnInit } from '@angular/core';
import { StandingResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-standings-list-item',
  templateUrl: './standings-list-item.component.html',
  styleUrls: ['./standings-list-item.component.scss'],
})
export class StandingsListItemComponent implements OnInit {
  @Input() position: number;
  @Input() player: StandingResponse;
  constructor() { }

  ngOnInit(): void {
  }

}
