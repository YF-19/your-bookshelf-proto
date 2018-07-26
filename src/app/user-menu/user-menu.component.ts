import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import * as M from 'materialize-css';

import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit, AfterViewInit {

  currentUser: User;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(
      loggedIn => this.currentUser = loggedIn ? this.authService.getCurrentUser() : null
    );
  }

  ngAfterViewInit() {
    // MaterializeのDropDownの設定
    M.Dropdown.init(document.querySelector('.dropdown-menu-trigger'), /*options*/{});
  }

  logout(): void {
    this.authService.logout();
    this.gotoLoginPage();
  }

  private gotoLoginPage() {
    this.router.navigateByUrl('/sign-x/in');
  }
}
