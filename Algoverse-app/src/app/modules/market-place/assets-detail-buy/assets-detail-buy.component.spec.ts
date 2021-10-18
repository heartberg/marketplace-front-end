import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsDetailBuyComponent } from './assets-detail-buy.component';

describe('AssetsDetailBuyComponent', () => {
  let component: AssetsDetailBuyComponent;
  let fixture: ComponentFixture<AssetsDetailBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsDetailBuyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsDetailBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
