import { TestBed } from '@angular/core/testing';

import { WhitelistGuard } from './whitelist.guard';

describe('WhitelistGuard', () => {
  let guard: WhitelistGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WhitelistGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
