import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchFormComponent } from 'src/app/match/match-form/match-form.component';
import { MatchHomeComponent } from 'src/app/match/match-home/match-home.component';
import { MatchListResolver } from 'src/app/match/resolvers/match-list.resolver';
import { MatchResolver } from 'src/app/match/resolvers/match.resolver';
import { TeamListResolver } from 'src/app/team/resolvers/team-list.resolver';
import { TournamentListResolver } from 'src/app/tournament/resolvers/tournament-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: MatchHomeComponent,
    resolve: {
      matches: MatchListResolver,
    },
  },
  {
    path: 'create',
    component: MatchFormComponent,
    resolve: {
      teams: TeamListResolver,
      tournaments: TournamentListResolver,
    },
  },
  {
    path: ':matchId',
    component: MatchFormComponent,
    resolve: {
      match: MatchResolver,
      teams: TeamListResolver,
      tournaments: TournamentListResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchRoutingModule { }
