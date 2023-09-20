import { TestBed } from '@angular/core/testing';

import { GuuidService } from './guuid.service';

describe('GuuidService', () => {
  let service: GuuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuuidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
