import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingMatchBetListComponent } from './betting-match-bet-list.component';

describe('BettingMatchBetListComponent', () => {
  let component: BettingMatchBetListComponent;
  let fixture: ComponentFixture<BettingMatchBetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BettingMatchBetListComponent ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingMatchBetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
