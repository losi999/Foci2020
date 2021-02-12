import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BettingHomeComponent } from './betting-home/betting-home.component';
import { BettingRoutingModule } from 'src/app/betting/betting-routing.module';
import { BettingMatchListComponent } from './betting-match-list/betting-match-list.component';
import { BettingMatchListMatchItemComponent } from './betting-match-list-match-item/betting-match-list-match-item.component';
import { BettingMatchListDayItemComponent } from './betting-match-list-day-item/betting-match-list-day-item.component';

@NgModule({
  declarations: [
    BettingHomeComponent,
    BettingMatchListComponent,
    BettingMatchListMatchItemComponent,
    BettingMatchListDayItemComponent,
  ],
  imports: [
    CommonModule,
    BettingRoutingModule,
  ],
})
export class BettingModule { }
