import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWrapperComponent } from './create-wrapper.component';

describe('CreateWrapperComponent', () => {
  let component: CreateWrapperComponent;
  let fixture: ComponentFixture<CreateWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
