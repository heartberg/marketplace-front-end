import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuiltInAlgorandComponent } from './built-in-algorand.component';

describe('BuiltInAlgorandComponent', () => {
  let component: BuiltInAlgorandComponent;
  let fixture: ComponentFixture<BuiltInAlgorandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuiltInAlgorandComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(BuiltInAlgorandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
