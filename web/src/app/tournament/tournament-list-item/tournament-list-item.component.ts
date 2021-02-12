import { Component, Input, OnInit } from '@angular/core';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { TournamentService } from 'src/app/tournament/tournament.service';

@Component({
  selector: 'app-tournament-list-item',
  templateUrl: './tournament-list-item.component.html',
  styleUrls: ['./tournament-list-item.component.scss'],
})
export class TournamentListItemComponent implements OnInit {
  @Input() tournament: TournamentResponse;

  constructor(private tournamentService: TournamentService) { }

  ngOnInit(): void {
  }

  onTournamentDelete() {
    this.tournamentService.deleteTournament(this.tournament.tournamentId);
  }

}
