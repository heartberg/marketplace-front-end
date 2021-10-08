import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCentreComponent } from './notification-centre.component';

describe('NotificationCentreComponent', () => {
  let component: NotificationCentreComponent;
  let fixture: ComponentFixture<NotificationCentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationCentreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
