import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDietarypreferenceComponent } from './admin-dietarypreference.component';

describe('AdminDietarypreferenceComponent', () => {
  let component: AdminDietarypreferenceComponent;
  let fixture: ComponentFixture<AdminDietarypreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDietarypreferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDietarypreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
