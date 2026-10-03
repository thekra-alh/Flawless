import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Camera } from './camera';

describe('Camera', () => {
  let component: Camera;
  let fixture: ComponentFixture<Camera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Camera],
    }).compileComponents();

    fixture = TestBed.createComponent(Camera);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
