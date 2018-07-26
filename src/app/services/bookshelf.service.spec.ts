import { TestBed, inject } from '@angular/core/testing';

import { BookshelfService } from './bookshelf.service';

describe('BookshelfService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookshelfService]
    });
  });

  it('should be created', inject([BookshelfService], (service: BookshelfService) => {
    expect(service).toBeTruthy();
  }));
});
