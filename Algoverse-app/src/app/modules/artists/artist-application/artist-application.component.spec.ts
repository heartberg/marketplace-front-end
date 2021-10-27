import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistApplicationComponent } from './artist-application.component';

describe('ArtistApplicationComponent', () => {
  let component: ArtistApplicationComponent;
  let fixture: ComponentFixture<ArtistApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtistApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
