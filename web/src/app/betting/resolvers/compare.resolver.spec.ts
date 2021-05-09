import { TestBed } from '@angular/core/testing';

import { CompareResolver } from './compare.resolver';

describe('CompareResolver', () => {
  let resolver: CompareResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CompareResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
