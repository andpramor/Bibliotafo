import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsCrudComponent } from './authors-crud.component';

describe('AuthorsCrudComponent', () => {
  let component: AuthorsCrudComponent;
  let fixture: ComponentFixture<AuthorsCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorsCrudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
