import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceshuttleComponent } from './spaceshuttle.component';

describe('SpaceshuttleComponent', () => {
  let component: SpaceshuttleComponent;
  let fixture: ComponentFixture<SpaceshuttleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceshuttleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceshuttleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
