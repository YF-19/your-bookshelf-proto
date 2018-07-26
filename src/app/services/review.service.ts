import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Book } from '../models/book';
import { Review } from '../models/review';
import { map } from 'rxjs/operators';
import { HttpUtil } from '../utils/http-util';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private static readonly url = HttpUtil.API_BASE_URL + '/reviews';

  constructor(private http: HttpClient) { }

  getReviewsOfBook(isbn: string): Observable<Review[]> {
    return this.http.get(`${ReviewService.url}/${isbn}`, HttpUtil.makeHttpOptions()).pipe(
      map<any, Review[]>(data => data.results.map(reviewData => new Review(reviewData)))
    );
  }

  createReview(book: Book, review: Review): Observable<any> {
    const body = { book: { isbn: book.isbn }, review: review.toSnakeCaseAttributes() };

    return this.http.post(ReviewService.url, body, HttpUtil.makeHttpOptions()).pipe(
      map(this.toReview)
    );
  }

  private toReview(data: any): Review {
    return new Review(data.review);
  }

  updateReview(review: Review): Observable<any> {
    const body = { review: review.toSnakeCaseAttributes() };

    return this.http.put(`${ReviewService.url}/${review.id}`, body, HttpUtil.makeHttpOptions()).pipe(
      map(this.toReview)
    );
  }

  deleteReview(review: Review): Observable<any> {
    return this.http.delete(`${ReviewService.url}/${review.id}`, HttpUtil.makeHttpOptions());
  }
}
