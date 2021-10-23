import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTimedAuctionComponent } from './create-timed-auction.component';

describe('CreateTimedAuctionComponent', () => {
  let component: CreateTimedAuctionComponent;
  let fixture: ComponentFixture<CreateTimedAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTimedAuctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTimedAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
