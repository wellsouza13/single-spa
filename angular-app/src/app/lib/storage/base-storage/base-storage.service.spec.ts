/* tslint:disable:no-unused-variable */

import { TestBed, inject } from "@angular/core/testing";
import { BaseStorageService } from "./base-storage.service";

describe("Service: BaseStorage", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseStorageService],
    });
  });

  it("should ...", inject(
    [BaseStorageService],
    (service: BaseStorageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
