import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirementComponent } from './virement.component';

describe('VirementComponent', () => {
  let component: VirementComponent;
  let fixture: ComponentFixture<VirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
