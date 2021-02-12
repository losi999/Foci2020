import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamListItemComponent } from './team-list-item/team-list-item.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { TeamHomeComponent } from './team-home/team-home.component';
import { TeamRoutingModule } from 'src/app/team/team-routing.module';

@NgModule({
  declarations: [
    TeamListComponent,
    TeamListItemComponent,
    TeamFormComponent,
    TeamHomeComponent,
  ],
  imports: [
    CommonModule,
    TeamRoutingModule,
  ],
})
export class TeamModule { }
