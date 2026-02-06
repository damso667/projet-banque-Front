import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboad } from './dashboad';

describe('Dashboad', () => {
  let component: Dashboad;
  let fixture: ComponentFixture<Dashboad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashboad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
