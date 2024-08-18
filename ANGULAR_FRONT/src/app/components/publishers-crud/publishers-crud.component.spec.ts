import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishersCrudComponent } from './publishers-crud.component';

describe('PublishersCrudComponent', () => {
  let component: PublishersCrudComponent;
  let fixture: ComponentFixture<PublishersCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublishersCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublishersCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
