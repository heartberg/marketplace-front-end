import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessHeaderComponent } from './access-header.component';

describe('AccessHeaderComponent', () => {
  let component: AccessHeaderComponent;
  let fixture: ComponentFixture<AccessHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
