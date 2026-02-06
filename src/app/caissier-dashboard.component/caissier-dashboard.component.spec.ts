import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaissierDashboardComponent } from './caissier-dashboard.component';

describe('CaissierDashboardComponent', () => {
  let component: CaissierDashboardComponent;
  let fixture: ComponentFixture<CaissierDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaissierDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaissierDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
