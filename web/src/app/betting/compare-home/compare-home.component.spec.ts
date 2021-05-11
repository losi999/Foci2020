import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareHomeComponent } from './compare-home.component';

describe('CompareHomeComponent', () => {
  let component: CompareHomeComponent;
  let fixture: ComponentFixture<CompareHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareHomeComponent ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
