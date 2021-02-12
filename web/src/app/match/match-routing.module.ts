import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchFormComponent } from 'src/app/match/match-form/match-form.component';
import { MatchHomeComponent } from 'src/app/match/match-home/match-home.component';

const routes: Routes = [
  {
    path: '',
    component: MatchHomeComponent,
  },
  {
    path: 'create',
    component: MatchFormComponent,
  },
  {
    path: ':matchId',
    component: MatchFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchRoutingModule { }
