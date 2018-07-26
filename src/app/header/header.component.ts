import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() currentUser: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // this.authService.isLoggedIn().subscribe(
    //   loggedIn => this.currentUser = loggedIn ? this.authService.getCurrentUser() : null
    // );
  }
}
