import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentFormComponent } from 'src/app/tournament/tournament-form/tournament-form.component';
import { TournamentHomeComponent } from 'src/app/tournament/tournament-home/tournament-home.component';
import { TournamentListResolver } from 'src/app/tournament/resolvers/tournament-list.resolver';
import { TournamentResolver } from 'src/app/tournament/resolvers/tournament.resolver';

const routes: Routes = [
  {
    path: '',
    component: TournamentHomeComponent,
    resolve: {
      tournaments: TournamentListResolver,
    },
  },
  {
    path: 'create',
    component: TournamentFormComponent,
  },
  {
    path: ':tournamentId',
    component: TournamentFormComponent,
    resolve: {
      tournament: TournamentResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TournamentRoutingModule { }
