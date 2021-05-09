import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingMatchBetPanelComponent } from './betting-match-bet-panel.component';

describe('BettingMatchBetPanelComponent', () => {
  let component: BettingMatchBetPanelComponent;
  let fixture: ComponentFixture<BettingMatchBetPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BettingMatchBetPanelComponent ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingMatchBetPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
