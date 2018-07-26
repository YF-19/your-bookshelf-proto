import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  currentUser: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(
      loggedIn => this.currentUser = loggedIn ? this.authService.getCurrentUser() : null
    );
  }

}
