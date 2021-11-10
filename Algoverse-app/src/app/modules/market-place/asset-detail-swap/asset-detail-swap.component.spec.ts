import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDetailSwapComponent } from './asset-detail-swap.component';

describe('AssetDetailSwapComponent', () => {
  let component: AssetDetailSwapComponent;
  let fixture: ComponentFixture<AssetDetailSwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetDetailSwapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDetailSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
