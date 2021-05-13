import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { addMinutes } from '@foci2020/shared/common/utils';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { MatchService } from 'src/app/match/match.service';

@Component({
  selector: 'app-match-list-item',
  templateUrl: './match-list-item.component.html',
  styleUrls: ['./match-list-item.component.scss'],
})
export class MatchListItemComponent implements OnInit {
  @Input() match: MatchResponse;
  form: FormGroup;

  constructor(private matchService: MatchService) { }

  ngOnInit(): void {
    if(new Date() >= addMinutes(105, new Date(this.match.startTime)) && !this.match.finalScore) {
      this.form = new FormGroup({
        homeScore: new FormControl(null, [
          Validators.required,
          Validators.min(0),
        ]),
        awayScore: new FormControl(null, [
          Validators.required,
          Validators.min(0),
        ]),
      });
    }
  }

  onMatchDelete() {
    if(confirm('Biztos törölni szeretnéd?')) {
      this.matchService.deleteMatch(this.match.matchId);
    }
  }

  onSetFinalScore() {
    this.matchService.setFinalScoreOfMatch(this.match.matchId, {
      homeScore: this.form.value.homeScore,
      awayScore: this.form.value.awayScore,
    }).subscribe({
      next: () => {
        this.form = undefined;
      },
    });
    console.log(this.form);
  }
}
