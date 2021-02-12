import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BettingHomeComponent } from 'src/app/betting/betting-home/betting-home.component';
import { BettingMatchListResolver } from 'src/app/betting/resolvers/betting-match-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: BettingHomeComponent,
    resolve: {
      matchList: BettingMatchListResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BettingRoutingModule { }
