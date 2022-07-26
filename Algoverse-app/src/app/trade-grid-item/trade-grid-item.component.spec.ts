import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeGridItemComponent } from './trade-grid-item.component';

describe('TradeGridItemComponent', () => {
  let component: TradeGridItemComponent;
  let fixture: ComponentFixture<TradeGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradeGridItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
