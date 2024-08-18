import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenresCrudComponent } from './genres-crud.component';

describe('GenresCrudComponent', () => {
  let component: GenresCrudComponent;
  let fixture: ComponentFixture<GenresCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenresCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenresCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
