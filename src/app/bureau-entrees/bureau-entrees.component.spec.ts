import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BureauEntreesComponent } from './bureau-entrees.component';

describe('BureauEntreesComponent', () => {
  let component: BureauEntreesComponent;
  let fixture: ComponentFixture<BureauEntreesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BureauEntreesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BureauEntreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
