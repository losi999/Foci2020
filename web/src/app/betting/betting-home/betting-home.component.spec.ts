import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingHomeComponent } from './betting-home.component';

describe('BettingHomeComponent', () => {
  let component: BettingHomeComponent;
  let fixture: ComponentFixture<BettingHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BettingHomeComponent ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
