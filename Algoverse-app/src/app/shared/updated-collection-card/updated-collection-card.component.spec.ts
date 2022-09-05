import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedCollectionCardComponent } from './updated-collection-card.component';

describe('UpdatedCollectionCardComponent', () => {
  let component: UpdatedCollectionCardComponent;
  let fixture: ComponentFixture<UpdatedCollectionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatedCollectionCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedCollectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
