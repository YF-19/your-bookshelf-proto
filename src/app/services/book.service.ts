import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { Book } from '../models/book';
import { HttpUtil } from '../utils/http-util';
import { def } from '../lib/my-functions';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private url = HttpUtil.API_BASE_URL + '/books';

  constructor(private http: HttpClient) { }

  getPopularBooks(): Observable<Book[]> {
    return this.http.get(`${this.url}/popular`, HttpUtil.makeHttpOptions()).pipe(
      map(this.toBooks),
    );
  }

  private toBooks(data: any): Book[] {
    return data.books.map(bookData => new Book(bookData));
  }

  searchBooks_old(term: string): Observable<Book[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<any>(`${this.url}/search?q=${term.trim()}`, HttpUtil.makeHttpOptions()).pipe(
      map(this.toBooks)
    );
  }

  // DBにあるデータ以降の結果は外部API（Google Books API）のデータが送られてくるようになっている
  // 結果に外部APIのデータが含まれる場合はlimitを超える可能性がある
  // limitが40で最後のDBデータが39件で、外部APIのデータがn件の場合、39+n件のデータが送られてくる
  searchBooks(query: { term: string, limit?: number, offset?: number }): Observable<Book[]> {
    if (!query.term.trim()) {
      return of([]);
    }

    const url = `${this.url}/search?q=${query.term.trim()}`
      + (def.existy(query.limit) ? `&limit=${query.limit}` : '')
      + (def.existy(query.offset) ? `&offset=${query.offset}` : '');

    return this.http.get<any>(url, HttpUtil.makeHttpOptions()).pipe(
      map(this.toBooks)
    );
  }

  getBook(isbn: string, userId?: string): Observable<Book> {
    const url = `${this.url}/${isbn}` + (userId ? `/users/${userId}` : '');

    return this.http.get(url, HttpUtil.makeHttpOptions()).pipe(
      map(this.toBook)
    );
  }

  private toBook(data: any): Book {
    return new Book(data.book);
  }

  requestBook(book: Book): Observable<Book> {
    const body = { book: book.toSnakeCaseAttributes() };

    return this.http.post(`${this.url}`, body, HttpUtil.makeHttpOptions()).pipe(
      map(this.toBook)
    );
  }

  approveBook(book: Book): Observable<Book> {
    return this.http.put(`${this.url}/${book.isbn}/approve`, {}, HttpUtil.makeHttpOptions()).pipe(
      map(this.toBook)
    );
  }

  rejectBook(book: Book): Observable<any> {
    return this.http.delete(`${this.url}/${book.isbn}/reject`, HttpUtil.makeHttpOptions());
  }
}
