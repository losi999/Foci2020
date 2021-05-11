import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from 'src/app/admin/admin-home/admin-home.component';

const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    children: [
      {
        path: 'tournaments',
        loadChildren: () => import('../tournament/tournament.module').then(m => m.TournamentModule),
      },
      {
        path: 'teams',
        loadChildren: () => import('../team/team.module').then(m => m.TeamModule),
      },
      {
        path: 'matches',
        loadChildren: () => import('../match/match.module').then(m => m.MatchModule),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
