import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingsListItemComponent } from './standings-list-item.component';

describe('StandingsListItemComponent', () => {
  let component: StandingsListItemComponent;
  let fixture: ComponentFixture<StandingsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandingsListItemComponent ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandingsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
