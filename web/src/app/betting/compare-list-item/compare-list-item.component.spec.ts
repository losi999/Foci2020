import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareListItemComponent } from './compare-list-item.component';

describe('CompareListItemComponent', () => {
  let component: CompareListItemComponent;
  let fixture: ComponentFixture<CompareListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
