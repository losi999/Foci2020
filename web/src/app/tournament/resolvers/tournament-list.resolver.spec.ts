import { TestBed } from '@angular/core/testing';

import { TournamentListResolver } from './tournament-list.resolver';

describe('TournamentListResolver', () => {
  let resolver: TournamentListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TournamentListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
