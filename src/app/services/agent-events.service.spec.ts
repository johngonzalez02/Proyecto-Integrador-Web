import { TestBed } from '@angular/core/testing';

import { AgentEventsService } from './agent-events.service';

describe('AgentEventsService', () => {
  let service: AgentEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
