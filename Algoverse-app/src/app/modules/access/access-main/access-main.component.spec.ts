import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessMainComponent } from './access-main.component';

describe('AccessMainComponent', () => {
  let component: AccessMainComponent;
  let fixture: ComponentFixture<AccessMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
