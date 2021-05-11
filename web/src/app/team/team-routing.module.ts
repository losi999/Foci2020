import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamListResolver } from 'src/app/team/resolvers/team-list.resolver';
import { TeamResolver } from 'src/app/team/resolvers/team.resolver';
import { TeamFormComponent } from 'src/app/team/team-form/team-form.component';
import { TeamHomeComponent } from 'src/app/team/team-home/team-home.component';

const routes: Routes = [
  {
    path: '',
    component: TeamHomeComponent,
    resolve: {
      teams: TeamListResolver,
    },
  },
  {
    path: 'create',
    component: TeamFormComponent,
  },
  {
    path: ':teamId',
    component: TeamFormComponent,
    resolve: {
      team: TeamResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule { }
