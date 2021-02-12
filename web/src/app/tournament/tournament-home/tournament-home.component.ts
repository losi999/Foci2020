import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { Subscription } from 'rxjs';
import { TournamentService } from 'src/app/tournament/tournament.service';

@Component({
  selector: 'app-tournament-home',
  templateUrl: './tournament-home.component.html',
  styleUrls: ['./tournament-home.component.scss'],
})
export class TournamentHomeComponent implements OnInit, OnChanges, OnDestroy, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked {
  tournaments: TournamentResponse[] ;
  private tournamentDeletedSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private tournamentService: TournamentService) {
    console.log('constructor');
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges', changes);
  }
  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    this.tournamentDeletedSubscription.unsubscribe();
  }
  ngDoCheck(): void {
    console.log('ngDoCheck');
  }
  ngAfterContentInit(): void {
    console.log('ngAfterContentInit');
  }
  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked');
  }
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
  }
  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked');
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.tournaments = this.activatedRoute.snapshot.data.tournaments;

    this.tournamentDeletedSubscription = this.tournamentService.tournamentDeleted.subscribe({
      next: (tournamentId) => {
        console.log('sub tournamentDeleted');
        this.tournaments = this.tournaments.filter(t => t.tournamentId !== tournamentId);
      },
    });
  }

}
