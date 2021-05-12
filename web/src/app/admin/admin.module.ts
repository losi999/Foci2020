import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRoutingModule } from 'src/app/admin/admin-routing.module';
// import { TournamentHomeComponent } from 'src/app/tournament/tournament-home/tournament-home.component';

@NgModule({
  declarations: [
    AdminHomeComponent,
    // TournamentHomeComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
  ],
})
export class AdminModule { }
