import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingMatchListComponent } from './betting-match-list.component';

describe('BettingMatchListComponent', () => {
  let component: BettingMatchListComponent;
  let fixture: ComponentFixture<BettingMatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BettingMatchListComponent ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingMatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
