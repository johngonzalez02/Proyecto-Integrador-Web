import { TestBed } from '@angular/core/testing';

import { AgentReservationsService } from './agent-reservations.service';

describe('AgentReservationsService', () => {
  let service: AgentReservationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentReservationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
