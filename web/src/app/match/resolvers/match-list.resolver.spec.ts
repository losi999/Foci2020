import { TestBed } from '@angular/core/testing';

import { TeamListResolver } from './match-list.resolver';

describe('TeamListResolver', () => {
  let resolver: TeamListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TeamListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
