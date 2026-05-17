import { TestBed } from '@angular/core/testing';

import { Musica } from './musica';

describe('Musica', () => {
  let service: Musica;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Musica);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
