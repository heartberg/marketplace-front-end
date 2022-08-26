import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessHeadingComponent } from './access-heading.component';

describe('AccessHeadingComponent', () => {
  let component: AccessHeadingComponent;
  let fixture: ComponentFixture<AccessHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessHeadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
