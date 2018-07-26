import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

import { ReviewService } from '../services/review.service';
import { Review } from '../models/review';
import { Book } from '../models/book';
import { User } from '../models/user';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  @Input() book: Book;
  @Input() currentUser: User;
  ownerReview: Review;
  reviews: Review[] = [];
  submitted = false;

  constructor(
    private reviewService: ReviewService,
    private location: Location,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    if (!this.book.isAvailable()) {
      return;
    }

    this.reviewService.getReviewsOfBook(this.book.isbn).subscribe(
      reviews => this.showReviews.call(this, reviews),
      error => this.handleError.call(this, error)
    );
  }

  // isBookOnLibraryUrl(): boolean {
  //   return /^\/books\/[\d]{13}$/.test(this.location.path());
  // }

  private showReviews(reviews: Review[]): void {
    if (!this.book.owner) {
      this.reviews = reviews;
      return;
    }

    const not = (predicate) => {
      return (...args) => !predicate.apply(null, args);
    };

    const writerIs = (user: User) => {
      return (r: Review) => r.writer.is(user);
    };

    const writerIsOwner = writerIs(this.book.owner);

    const review = reviews.find(writerIsOwner);
    this.ownerReview = review ? review : new Review({});
    this.reviews = reviews.filter(not(writerIsOwner));
  }

  private handleError(error): void {
    this.messageService.showMessages(error.error.messages);
  }

/**
 * ログインしている
 * 　Libraryの本
 * 　　本棚に追加する
 * 　自分の本棚の本
 * 　　本棚から削除する/追加する
 * 　　レビューを投稿/編集する/レビューを削除する
 * 　他人の本棚の本
 * ログインしていない
 */
  writeReview(): void {
    this.submitted = true;

    if (this.ownerReview.isDoneFirstPost()) {
      this.editReview();
    } else {
      this.postReview();
    }
  }

  private postReview(): void {
    this.reviewService.createReview(this.book, this.ownerReview).subscribe(
      postedReview => {
        this.ownerReview = postedReview;
        this.submitted = false;
      },
      error => {
        this.handleError.call(this, error);
        this.submitted = false;
      }
    );
  }

  private editReview(): void {
    this.reviewService.updateReview(this.ownerReview).subscribe(
      updatedReview => {
        this.ownerReview = updatedReview;
        this.submitted = false;
      },
      error => {
        this.handleError.call(this, error);
        this.submitted = false;
      }
    );
  }

  deleteReview(): void {
    this.submitted = true;

    this.reviewService.deleteReview(this.ownerReview).subscribe(
      data => {
        this.ownerReview = new Review({});
        this.submitted = false;
      },
      error => {
        this.handleError.call(this, error);
        this.submitted = false;
      }
    );
  }
}
