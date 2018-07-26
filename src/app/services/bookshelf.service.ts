import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { Bookshelf } from '../models/bookshelf';
import { Book } from '../models/book';
import { User } from '../models/user';
import { Model } from '../models/model';
import { HttpUtil } from '../utils/http-util';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root'
})
export class BookshelfService {
  private readonly url = HttpUtil.API_BASE_URL + '/bookshelves';

  constructor(private http: HttpClient) { }

  getPopularBookshelves(): Observable<Bookshelf[]> {
    return this.http.get(`${this.url}/popular`, HttpUtil.makeHttpOptions()).pipe(
      map(this.toBookshelves)
    );
  }

  private toBookshelves(data: any): Bookshelf[] {
    return data.results.map(shelfData => new Bookshelf(shelfData));
  }

  searchBookshelves(term: string): Observable<Bookshelf[]> {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      return of([]);
    }

    return this.http.get(`${this.url}/search?q=${trimmedTerm}`, HttpUtil.makeHttpOptions()).pipe(
      map(this.toBookshelves)
    );
  }

  getBookshelf(id: number): Observable<Bookshelf> {
    return this.http.get(`${this.url}/${id}`, HttpUtil.makeHttpOptions()).pipe(
      map(shelfData => new Bookshelf(shelfData))
    );
  }

  addBookToShelf(bookshlefId, book: Book): Observable<Book> {
    return this.http.post(`${this.url}/${bookshlefId}/books/${book.isbn}`, {}, HttpUtil.makeHttpOptions()).pipe(
      map<any, Book>(data => new Book(data.book))
    );
  }

  deleteBookFromShelf(bookshlefId, book: Book): Observable<any> {
    return this.http.delete(`${this.url}/${bookshlefId}/books/${book.isbn}`, HttpUtil.makeHttpOptions());
  }
}
