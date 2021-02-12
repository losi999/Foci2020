import { TestBed } from '@angular/core/testing';

import { BettingMatchListResolver } from './betting-match-list.resolver';

describe('BettingMatchListResolver', () => {
  let resolver: BettingMatchListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BettingMatchListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
