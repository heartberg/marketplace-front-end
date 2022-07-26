import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionGridItemComponent } from './auction-grid-item.component';

describe('AuctionGridItemComponent', () => {
  let component: AuctionGridItemComponent;
  let fixture: ComponentFixture<AuctionGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionGridItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
