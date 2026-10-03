import { TestBed } from '@angular/core/testing';

import { SkinData } from './skin-data';

describe('SkinData', () => {
  let service: SkinData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkinData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
