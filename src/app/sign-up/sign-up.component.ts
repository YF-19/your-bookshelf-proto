import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUp: { username?: string, email?: string, password?: string } = {};
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

    this.authService.register(this.signUp.username, this.signUp.email, this.signUp.password).subscribe(
      currentUser => this.router.navigateByUrl(`/bookshelves/${currentUser.bookshelfId}`),
      error => {
        this.submitted = false;
        this.messageService.showMessages(error.error.messages);
      }
    );
  }
}
