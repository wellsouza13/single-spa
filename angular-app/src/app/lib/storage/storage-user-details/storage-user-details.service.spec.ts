/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StorageUserDetailsService } from './storage-user-details.service';

describe('Service: StorageUserDetails', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageUserDetailsService]
    });
  });

  it('should ...', inject([StorageUserDetailsService], (service: StorageUserDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
