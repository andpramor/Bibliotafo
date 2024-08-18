import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemesCrudComponent } from './themes-crud.component';

describe('ThemesCrudComponent', () => {
  let component: ThemesCrudComponent;
  let fixture: ComponentFixture<ThemesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThemesCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThemesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
