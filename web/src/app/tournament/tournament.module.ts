import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentHomeComponent } from './tournament-home/tournament-home.component';
import { TournamentRoutingModule } from 'src/app/tournament/tournament-routing.module';
import { TournamentListItemComponent } from './tournament-list-item/tournament-list-item.component';
import { TournamentListComponent } from './tournament-list/tournament-list.component';
import { TournamentFormComponent } from './tournament-form/tournament-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TournamentHomeComponent,
    TournamentListItemComponent,
    TournamentListComponent,
    TournamentFormComponent,
  ],
  imports: [
    CommonModule,
    TournamentRoutingModule,
    ReactiveFormsModule,
  ],
})
export class TournamentModule { }
