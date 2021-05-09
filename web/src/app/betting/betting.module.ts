import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BettingHomeComponent } from './betting-home/betting-home.component';
import { BettingRoutingModule } from 'src/app/betting/betting-routing.module';
import { BettingMatchListComponent } from './betting-match-list/betting-match-list.component';
import { BettingMatchListMatchItemComponent } from './betting-match-list-match-item/betting-match-list-match-item.component';
import { BettingMatchListDayItemComponent } from './betting-match-list-day-item/betting-match-list-day-item.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { ReactiveFormsModule } from '@angular/forms';
import { BettingMatchBetPanelComponent } from './betting-match-bet-panel/betting-match-bet-panel.component';
import { BettingMatchBetListComponent } from './betting-match-bet-list/betting-match-bet-list.component';
import { BettingMatchOwnBetComponent } from './betting-match-own-bet/betting-match-own-bet.component';
import { BetResultToCssClassPipe } from '../pipes/bet-result-to-css-class.pipe';

@NgModule({
  declarations: [
    BettingHomeComponent,
    BettingMatchListComponent,
    BettingMatchListMatchItemComponent,
    BettingMatchListDayItemComponent,
    BettingMatchBetPanelComponent,
    BettingMatchBetListComponent,
    BettingMatchOwnBetComponent,
    BetResultToCssClassPipe,
  ],
  imports: [
    CommonModule,
    BettingRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
})
export class BettingModule {
  constructor(private library: FaIconLibrary) {
    this.library.addIcons(faCaretUp, faCaretDown);
  }
}
