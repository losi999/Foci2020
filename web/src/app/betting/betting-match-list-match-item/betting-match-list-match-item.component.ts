import { Component, Input, OnInit } from '@angular/core';
import { BetRequest } from '@foci2020/shared/types/requests';
import { BetResponse, MatchResponse } from '@foci2020/shared/types/responses';
import { AuthService } from 'src/app/auth/auth.service';
import { BettingService } from '../betting.service';
import { addMinutes } from '@foci2020/shared/common/utils';

@Component({
  selector: 'app-betting-match-list-match-item',
  templateUrl: './betting-match-list-match-item.component.html',
  styleUrls: ['./betting-match-list-match-item.component.scss'],
})
export class BettingMatchListMatchItemComponent implements OnInit {
  @Input() match: MatchResponse;
  isExpanded: boolean;
  isInitiating: boolean;

  bets: BetResponse[];
  ownBet: BetResponse;

  constructor(private bettingService: BettingService, private authService: AuthService) { }

  get hasBettingExpired(): boolean {
    return addMinutes(5).toISOString() > this.match.startTime;
  }

  ngOnInit(): void {
    this.isExpanded = false;
    this.isInitiating = true;
  }

  betSent(event: BetRequest) {
    console.log('BETSENT', event);
    this.ownBet = event as BetResponse;
    this.fetchBets();
  }

  fetchBets() {
    this.bettingService.listBetsOfMatch(this.match.matchId).subscribe((bets) => {
      this.isInitiating = false;
      this.bets = bets.filter(b => b.userId !== this.authService.userId);
      this.ownBet = bets.find(b => b.userId === this.authService.userId);

      console.log('OTHER', this.bets);
      console.log('OWN', this.ownBet);
    });
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.fetchBets();
    }
  }
}
