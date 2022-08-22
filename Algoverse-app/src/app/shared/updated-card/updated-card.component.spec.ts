import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedCardComponent } from './updated-card.component';

describe('UpdatedCardComponent', () => {
  let component: UpdatedCardComponent;
  let fixture: ComponentFixture<UpdatedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatedCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
