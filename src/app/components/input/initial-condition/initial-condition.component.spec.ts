import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialConditionComponent } from './initial-condition.component';

describe('InitialConditionComponent', () => {
  let component: InitialConditionComponent;
  let fixture: ComponentFixture<InitialConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialConditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
