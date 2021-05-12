import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BetRequest } from '@foci2020/shared/types/requests';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { BettingService } from '../betting.service';

@Component({
  selector: 'app-betting-match-bet-panel',
  templateUrl: './betting-match-bet-panel.component.html',
  styleUrls: ['./betting-match-bet-panel.component.scss'],
})
export class BettingMatchBetPanelComponent implements OnInit {
  isBettingInProgress: boolean;
  form: FormGroup;
  @Input() match: MatchResponse;
  @Output() betSent = new EventEmitter<BetRequest>();

  constructor(private bettingService: BettingService) { }

  ngOnInit(): void {
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

  onSubmit() {
    this.form.markAllAsTouched();

    if(this.form.valid) {
      this.isBettingInProgress = true;
      const request: BetRequest = {
        homeScore: this.form.value.homeScore,
        awayScore: this.form.value.awayScore,
      };

      this.bettingService.placeBet(this.match.matchId, request).subscribe({
        next: () => {
          console.log('¯\\_(ツ)_/¯');
          this.betSent.emit(request);
        },
        error: () => {
          console.log('ERROR ¯\\_(ツ)_/¯');
          this.isBettingInProgress = false;
        },
      });
    }
  }

}
