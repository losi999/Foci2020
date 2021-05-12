import { TestBed } from '@angular/core/testing';

import { MatchResolver } from './match.resolver';

describe('MatchResolver', () => {
  let resolver: MatchResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(MatchResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
