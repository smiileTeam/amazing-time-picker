import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtpTimePickerComponent } from './atp-time-picker.component';

describe('AtpTimePickerComponent', () => {
  let component: AtpTimePickerComponent;
  let fixture: ComponentFixture<AtpTimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtpTimePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtpTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
