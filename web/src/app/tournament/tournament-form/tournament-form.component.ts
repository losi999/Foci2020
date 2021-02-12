import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { TournamentService } from 'src/app/tournament/tournament.service';

@Component({
  selector: 'app-tournament-form',
  templateUrl: './tournament-form.component.html',
  styleUrls: ['./tournament-form.component.scss'],
})
export class TournamentFormComponent implements OnInit {
  form: FormGroup;
  get tournament (): TournamentResponse {
    return this.activatedRoute.snapshot.data.tournament;
  }

  constructor(private tournamentService: TournamentService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      tournamentName: new FormControl(this.tournament?.tournamentName, [Validators.required]),
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    const next = () => {
      this.router.navigate(['admin/tournaments']);
    };

    const error = (error) => {
      console.log(error);
    };

    if(this.form.valid) {
      if(this.tournament) {
        this.tournamentService.updateTournament(this.tournament.tournamentId, {
          tournamentName: this.form.value.tournamentName,
        }).subscribe({
          next,
          error,
        });
      } else {
        this.tournamentService.createTournament({
          tournamentName: this.form.value.tournamentName,
        }).subscribe({
          next,
          error,
        });
      }
    }
  }

}
