import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimedAuctionCardComponent } from './timed-auction-card.component';

describe('TimedAuctionCardComponent', () => {
  let component: TimedAuctionCardComponent;
  let fixture: ComponentFixture<TimedAuctionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimedAuctionCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimedAuctionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
