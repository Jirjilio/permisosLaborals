import { TestBed } from '@angular/core/testing';

import { Empleats } from './empleats';

describe('Empleats', () => {
  let service: Empleats;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Empleats);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
