import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StranaComponent } from './strana.component';

describe('StranaComponent', () => {
  let component: StranaComponent;
  let fixture: ComponentFixture<StranaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StranaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StranaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
