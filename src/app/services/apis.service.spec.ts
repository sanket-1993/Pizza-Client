import { TestBed, inject } from '@angular/core/testing';

import { APIsService } from './apis.service';

describe('APIsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIsService]
    });
  });

  it('should be created', inject([APIsService], (service: APIsService) => {
    expect(service).toBeTruthy();
  }));
});
