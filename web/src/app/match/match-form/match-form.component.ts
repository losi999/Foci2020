import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchRequest } from '@foci2020/shared/types/requests';
import { MatchResponse, TeamResponse, TournamentResponse } from '@foci2020/shared/types/responses';
import { MatchService } from 'src/app/match/match.service';

@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.scss'],
})
export class MatchFormComponent implements OnInit {
  form: FormGroup;
  get match (): MatchResponse {
    return this.activatedRoute.snapshot.data.match;
  }
  get teams (): TeamResponse[] {
    return this.activatedRoute.snapshot.data.teams;
  }
  get tournaments (): TournamentResponse[] {
    return this.activatedRoute.snapshot.data.tournaments;
  }

  constructor(private matchService: MatchService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const date = this.match && new Date(this.match.startTime);
    this.form = new FormGroup({
      group: new FormControl(this.match?.group),
      stadium: new FormControl(this.match?.stadium),
      city: new FormControl(this.match?.city, [Validators.required]),
      homeTeamId: new FormControl(this.match?.homeTeam.teamId, [Validators.required]),
      awayTeamId: new FormControl(this.match?.awayTeam.teamId, [Validators.required]),
      tournamentId: new FormControl(this.match?.tournament.tournamentId, [Validators.required]),
      startDate: new FormControl(date ? {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      } : undefined, [Validators.required]),
      startTime: new FormControl(date ? {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
      } : undefined, [Validators.required]),
    });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    const next = () => {
      this.router.navigate(['admin/matches']);
    };

    const error = (error) => {
      console.log(error);
    };

    if(this.form.valid) {
      const { year, month, day } = this.form.value.startDate;
      const { hour, minute, second } = this.form.value.startTime;
      const date = new Date(year, month - 1, day, hour, minute, second);

      const request: MatchRequest = {
        homeTeamId: this.form.value.homeTeamId,
        awayTeamId: this.form.value.awayTeamId,
        tournamentId: this.form.value.tournamentId,
        group: this.form.value.group || undefined,
        stadium: this.form.value.stadium || undefined,
        city: this.form.value.city,
        startTime: date.toISOString(),
      };

      if(this.match) {
        this.matchService.updateMatch(this.match.matchId, request).subscribe({
          next,
          error,
        });
      } else {
        this.matchService.createMatch(request).subscribe({
          next,
          error,
        });
      }
    }
  }
}
