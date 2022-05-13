import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapGridItemComponent } from './swap-grid-item.component';

describe('SwapGridItemComponent', () => {
  let component: SwapGridItemComponent;
  let fixture: ComponentFixture<SwapGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwapGridItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
