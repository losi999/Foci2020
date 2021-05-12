import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StandingResponse } from '@foci2020/shared/types/responses';

@Component({
  selector: 'app-standings-list',
  templateUrl: './standings-list.component.html',
  styleUrls: ['./standings-list.component.scss'],
})
export class StandingsListComponent implements OnInit {
  standings: StandingResponse[];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.standings = this.activatedRoute.snapshot.data.standings;
  }

}
