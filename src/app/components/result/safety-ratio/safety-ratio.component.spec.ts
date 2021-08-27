import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyRatioComponent } from './safety-ratio.component';

describe('SafetyRatioComponent', () => {
  let component: SafetyRatioComponent;
  let fixture: ComponentFixture<SafetyRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafetyRatioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
