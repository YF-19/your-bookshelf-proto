import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  currentUser: User;
  submitted = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(
      loggedIn => this.currentUser = loggedIn ? this.authService.getCurrentUser() : null
    );
  }

  deleteAccount(): void {
    this.submitted = true;

    this.userService.deleteUser(this.currentUser).subscribe(
      () => {
        this.authService.logout();
        this.router.navigateByUrl('/sign-x/up');
      },
      error => {
        this.submitted = false;
        this.messageService.showMessages(error.error.messages);
      }
    );
  }
}
