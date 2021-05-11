import { TestBed } from '@angular/core/testing';

import { StandingsListResolver } from './standings-list.resolver';

describe('StandingsListResolver', () => {
  let resolver: StandingsListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(StandingsListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
