import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamFormComponent } from 'src/app/team/team-form/team-form.component';
import { TeamHomeComponent } from 'src/app/team/team-home/team-home.component';

const routes: Routes = [
  {
    path: '',
    component: TeamHomeComponent,
  },
  {
    path: 'create',
    component: TeamFormComponent,
  },
  {
    path: ':teamId',
    component: TeamFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule { }
