import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietaryPreferencesModalComponent } from './dietary-preferences-modal.component';

describe('DietaryPreferencesModalComponent', () => {
  let component: DietaryPreferencesModalComponent;
  let fixture: ComponentFixture<DietaryPreferencesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietaryPreferencesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietaryPreferencesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
