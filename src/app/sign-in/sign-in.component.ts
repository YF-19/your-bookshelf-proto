import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  login: { usernameOrEmail?: string, password?: string } = {};
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
  }

  onSubmit(): void {
    this.submitted = true;

    this.authService.login(this.login.usernameOrEmail, this.login.password).subscribe(
      currentUser => this.router.navigateByUrl(`bookshelves/${currentUser.bookshelfId}`),
      error => {
        this.submitted = false;
        this.messageService.showMessages(error.error.messages);
      }
    );
  }
}
