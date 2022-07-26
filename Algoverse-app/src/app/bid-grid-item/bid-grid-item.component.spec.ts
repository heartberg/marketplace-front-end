import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidGridItemComponent } from './bid-grid-item.component';

describe('BidGridItemComponent', () => {
  let component: BidGridItemComponent;
  let fixture: ComponentFixture<BidGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidGridItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
