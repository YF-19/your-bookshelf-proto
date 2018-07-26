import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-sign-x',
  templateUrl: './sign-x.component.html',
  styleUrls: ['./sign-x.component.css']
})
export class SignXComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(
      // すでにログインしているならば、ユーザーの本棚ページに遷移する
      loggedIn => {
        if (loggedIn) {
          this.gotoBookshelfOf(this.authService.getCurrentUser());
        }
      }
    );
  }

  private gotoBookshelfOf(user: User): void {
    this.router.navigateByUrl(`/bookshelves/${user.bookshelfId}`);
  }
}
