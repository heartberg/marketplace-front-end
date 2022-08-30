import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessConnectComponent } from './access-connect.component';

describe('AccessConnectComponent', () => {
  let component: AccessConnectComponent;
  let fixture: ComponentFixture<AccessConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessConnectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
