import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingMatchOwnBetComponent } from './betting-match-own-bet.component';

describe('BettingMatchOwnBetComponent', () => {
  let component: BettingMatchOwnBetComponent;
  let fixture: ComponentFixture<BettingMatchOwnBetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BettingMatchOwnBetComponent ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingMatchOwnBetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
