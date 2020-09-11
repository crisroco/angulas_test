import { TestBed } from '@angular/core/testing';

import { InputsService } from './inputs.service';

describe('InputsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InputsService = TestBed.get(InputsService);
    expect(service).toBeTruthy();
  });
});
