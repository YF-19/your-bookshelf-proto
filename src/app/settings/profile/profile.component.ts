import { Component, OnInit, Input } from '@angular/core';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Model } from '../../models/model';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  copyCurrentUser: User;
  submitted = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(
      loggedIn => this.copyCurrentUser = loggedIn ? this.authService.getCurrentUser().clone() as User : null
    );
  }

  updateProfile(): void {
    this.submitted = true;

    this.userService.updateUser(this.copyCurrentUser, Model.whitelistFilter(['name'])).subscribe(
      updatedUser => {
        this.submitted = false;
        this.authService.updateCurrentUser(updatedUser);
      },
      error => {
        this.submitted = false;
        this.messageService.showMessages(error.error.messages);
      }
    );
  }
}
