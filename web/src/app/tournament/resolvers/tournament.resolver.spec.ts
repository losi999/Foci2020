import { TestBed } from '@angular/core/testing';

import { TournamentResolver } from './tournament.resolver';

describe('TournamentResolver', () => {
  let resolver: TournamentResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TournamentResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
