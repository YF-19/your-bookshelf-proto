import { Component, OnInit } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, merge } from 'rxjs/operators';

import { Bookshelf } from '../models/bookshelf';
import { BookshelfService } from '../services/bookshelf.service';

@Component({
  selector: 'app-bookshelves',
  templateUrl: './bookshelves.component.html',
  styleUrls: ['./bookshelves.component.css']
})
export class BookshelvesComponent implements OnInit {

  bookshelves$: Observable<any[]>;
  private searchTerms = new Subject<string>();

  constructor(private bookshelfService: BookshelfService) { }

  ngOnInit() {
    const popularShelves$ = this.bookshelfService.getPopularBookshelves();

    const searchResults$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.bookshelfService.searchBookshelves(term))
    );

    // 初回はポピュラーだけを表示するようになる（ポピュラーは1回だけしか流れないはずで、初回はポピュラーと空の検索結果をマージするため）
    this.bookshelves$ = popularShelves$.pipe(
      merge(searchResults$)
    );
  }

  search(term: string) {
    this.searchTerms.next(term);
  }

}
