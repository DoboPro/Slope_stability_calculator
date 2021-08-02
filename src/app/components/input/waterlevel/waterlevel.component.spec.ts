import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterlevelComponent } from './waterlevel.component';

describe('WaterlevelComponent', () => {
  let component: WaterlevelComponent;
  let fixture: ComponentFixture<WaterlevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterlevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterlevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
