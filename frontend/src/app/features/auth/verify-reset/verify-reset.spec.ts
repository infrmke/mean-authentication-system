import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyReset } from './verify-reset';

describe('VerifyReset', () => {
  let component: VerifyReset;
  let fixture: ComponentFixture<VerifyReset>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyReset],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyReset);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
