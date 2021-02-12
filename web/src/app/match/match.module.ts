import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchListComponent } from './match-list/match-list.component';
import { MatchListItemComponent } from './match-list-item/match-list-item.component';
import { MatchFormComponent } from './match-form/match-form.component';
import { MatchHomeComponent } from './match-home/match-home.component';
import { MatchRoutingModule } from 'src/app/match/match-routing.module';

@NgModule({
  declarations: [
    MatchListComponent,
    MatchListItemComponent,
    MatchFormComponent,
    MatchHomeComponent,
  ],
  imports: [
    CommonModule,
    MatchRoutingModule,
  ],
})
export class MatchModule { }
