import { Component, Input } from '@angular/core';
import { StandingResponse } from '@foci2020/shared/types/responses';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-standings-list-item',
  templateUrl: './standings-list-item.component.html',
  styleUrls: ['./standings-list-item.component.scss'],
})
export class StandingsListItemComponent {
  @Input() position: number;
  @Input() player: StandingResponse;

  get ownUserId(): string {
    return this.authService.userId;
  }

  constructor(private authService: AuthService) { }
}
