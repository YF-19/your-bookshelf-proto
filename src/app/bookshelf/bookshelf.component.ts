import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { BookshelfService } from '../services/bookshelf.service';
import { Bookshelf } from '../models/bookshelf';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { combineLatest } from 'rxjs';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.css']
})
export class BookshelfComponent implements OnInit {

  currentUser: User;
  bookshelf: Bookshelf;

  constructor(
    private bookshelfService: BookshelfService,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    const bookshelf$ = this.bookshelfService.getBookshelf(id);
    const loggedIn$ = this.authService.isLoggedIn();

    const shelfAndLoggedIn$ = combineLatest(bookshelf$, loggedIn$, (shelf, loggedIn) => [shelf, loggedIn]);

    shelfAndLoggedIn$.subscribe(
      (data: [Bookshelf, boolean]) => {
        this.bookshelf = data[0];
        this.currentUser = data[1] ? this.authService.getCurrentUser() : null;
      },
      error => this.messageService.showMessages(error.error.messages)
    );
  }

}
