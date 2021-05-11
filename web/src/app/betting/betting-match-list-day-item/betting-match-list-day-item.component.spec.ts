import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingMatchListDayItemComponent } from './betting-match-list-day-item.component';

describe('BettingMatchListDayItemComponent', () => {
  let component: BettingMatchListDayItemComponent;
  let fixture: ComponentFixture<BettingMatchListDayItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BettingMatchListDayItemComponent ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingMatchListDayItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
