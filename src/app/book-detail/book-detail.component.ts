import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Book } from '../models/book';
import { BookService } from '../services/book.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { BookStatus } from '../enums/book-status.enum';
import { BookshelfService } from '../services/bookshelf.service';
import { combineLatest } from 'rxjs';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  book: Book;
  currentUser: User;

  // リクエスト後のレスポンスに含まれる新しいブックステータスに更新するための関数
  // thisの値を固定する必要があったため、bindしている
  private updateBookStatus = ((newStatus: BookStatus) => this.book.status = newStatus).bind(this);

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location,
    private bookshelfService: BookshelfService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    const loggedIn$ = this.authService.isLoggedIn();
    const isbn = this.route.snapshot.paramMap.get('isbn');
    const userId = this.route.firstChild ? this.route.firstChild.snapshot.paramMap.get('user_id') : null;
    const book$ = this.bookService.getBook(isbn, userId);

    const loggedInAndBook$ = combineLatest(loggedIn$, book$, (loggedIn, book) => [loggedIn, book]);

    loggedInAndBook$.subscribe(
      (data: [boolean, Book]) => {
        this.currentUser = data[0] ? this.authService.getCurrentUser() : null;
        this.book = data[1];
      },
      error => this.handleError.call(this, error)
    );
  }

  private handleError(error) {
    this.messageService.showMessages(error.error.messages);
  }

  request(): void {
    this.bookService.requestBook(this.book).subscribe(
      book => this.book = book,
      error => this.handleError.call(this, error)
    );
  }

  approve(): void {
    this.bookService.approveBook(this.book).subscribe(
      book => this.book = book,
      error => this.handleError.call(this, error)
    );
  }

  reject(): void {
    this.bookService.rejectBook(this.book).subscribe(
      _ => this.book.reject(),
      error => this.handleError.call(this, error)
    );
  }

  addBookToBookshelf(): void {
    this.bookshelfService.addBookToShelf(this.currentUser.bookshelfId, this.book).subscribe(
      book => {
        this.book.isOwnedByCurrentUser = true;
        this.book.storedCount = book.storedCount;
      },
      error => this.handleError.call(this, error)
    );
  }

  deleteBookFromBookshelf(): void {
    this.bookshelfService.deleteBookFromShelf(this.currentUser.bookshelfId, this.book).subscribe(
      () => {
        this.book.isOwnedByCurrentUser = false;
        this.book.storedCount--;

        // 自分の本棚から遷移してきた場合は本棚ページに遷移する
        if (this.book.owner) {
          this.router.navigateByUrl(`/bookshelves/${this.currentUser.bookshelfId}`);
        }
      },
      error => this.handleError.call(this, error)
    );
  }

  goBack(): void {
    this.location.back();
  }
}
