import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingMatchListMatchItemComponent } from './betting-match-list-match-item.component';

describe('BettingMatchListMatchItemComponent', () => {
  let component: BettingMatchListMatchItemComponent;
  let fixture: ComponentFixture<BettingMatchListMatchItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BettingMatchListMatchItemComponent ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingMatchListMatchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
