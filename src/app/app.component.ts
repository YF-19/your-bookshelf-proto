import { Component, OnInit } from '@angular/core';

import { fromEvent } from 'rxjs';

import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'your-bookshelf';
  currentUser: User;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(
      loggedIn => this.currentUser = loggedIn ? this.authService.getCurrentUser() : null
    );

    this.changeMinHeightOfMainContent();

    fromEvent(window, 'resize').pipe(throttleTime(100)).subscribe(
      event => this.changeMinHeightOfMainContent()
    );
  }

  // メインコンテンツのmin-heightを画面サイズに応じて変更する
  // メインコンテンツの中身が少ないときページ全体が画面内にちょうど収まるようにすることが目的
  private changeMinHeightOfMainContent(): void {
    const headerHeight = document.getElementById('header').clientHeight;
    const footerHeight = document.getElementById('footer').clientHeight;
    const mainMinHeight = window.innerHeight - headerHeight - footerHeight;

    document.getElementById('main').style.minHeight = mainMinHeight + 'px';
  }
}
