import { TestBed, inject } from '@angular/core/testing';

import { MessageProviderService } from './message-provider.service';

describe('MessageProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageProviderService]
    });
  });

  it('should be created', inject([MessageProviderService], (service: MessageProviderService) => {
    expect(service).toBeTruthy();
  }));
});
