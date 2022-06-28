import { TestBed } from '@angular/core/testing';

import { IpfsDaemonService } from '../services/ipfs-daemon.service';

describe('IpfsDaemonService', () => {
  let service: IpfsDaemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpfsDaemonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
