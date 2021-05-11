import { Component, Input, OnInit } from '@angular/core';
import { TournamentResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.scss'],
})
export class TournamentListComponent implements OnInit {
  @Input() tournaments: TournamentResponse[];

  constructor() { }

  ngOnInit(): void {
  }

}
