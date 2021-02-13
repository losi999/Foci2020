import { Component, Input, OnInit } from '@angular/core';
import { TeamResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})
export class TeamListComponent implements OnInit {
  @Input() teams: TeamResponse[];

  constructor() { }

  ngOnInit(): void {
  }

}
