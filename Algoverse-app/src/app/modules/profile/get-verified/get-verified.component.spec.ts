import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetVerifiedComponent } from './get-verified.component';

describe('GetVerifiedComponent', () => {
  let component: GetVerifiedComponent;
  let fixture: ComponentFixture<GetVerifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetVerifiedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetVerifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
