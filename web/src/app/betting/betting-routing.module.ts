import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BettingHomeComponent } from 'src/app/betting/betting-home/betting-home.component';
import { BettingMatchListResolver } from 'src/app/betting/resolvers/betting-match-list.resolver';
import { StandingsListResolver } from './resolvers/standings-list.resolver';
import { StandingsListComponent } from './standings-list/standings-list.component';

const routes: Routes = [
  {
    path: '',
    component: BettingHomeComponent,
    resolve: {
      matchList: BettingMatchListResolver,
    },
  },
  {
    path: 'standings',
    component: StandingsListComponent,
    resolve: {
      standings: StandingsListResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BettingRoutingModule { }
