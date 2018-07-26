import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, catchError, mapTo } from 'rxjs/operators';

import { User } from '../models/user';
import { UserService } from './user.service';
import { HTTP_CONSTANTS } from '../constants/http-constants';
import { HttpUtil } from '../utils/http-util';

// 認証（Authentication）・認可（Authorization）に関するサービスを提供するクラス
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Subjectにログインの真偽値を流す前にカレントユーザーに値を設定する必要がある
  // コンポーネント側でログインを検出したのでカレントユーザーを取得したらnullが返ってくるようにしてはいけない
  currentUser: User;
  loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(HTTP_CONSTANTS) private httpConstants: any,
    private http: HttpClient,
    private userService: UserService
  ) {
    this.getLoggedInUser().subscribe(
      user => {
        this.currentUser = user;
        this.loggedInSubject.next(!!user);
      },
      error => {
        this.currentUser = null;
        this.loggedInSubject.next(false);
      }
    );
  }

  mixinCurrentUser(targetComponent: any, loggedIn: boolean): void {
     targetComponent.currentUser = loggedIn ? this.getCurrentUser() : null;
  }

  // トークンを持っていない、つまりログインしていなければnullオブザーバブルを返す
  private getLoggedInUser(): Observable<User> {
    if (!localStorage.getItem('token')) {
      return of(null);
    }

    return this.http.get<any>(`${HttpUtil.API_BASE_URL}/users/current-user`, HttpUtil.makeHttpOptions()).pipe(
      map<any, User>(data => new User(data.currentUser))
    );
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  updateCurrentUser(user: User) {
    this.currentUser.update(user);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject;
  }

  register(username: string, email: string, password: string): Observable<User> {
    return this.userService.createUser(username, email, password).pipe(
      tap(data => this.updateStateToLogin.call(this, data)),
      map(this.toUser),
    );
  }

  private updateStateToLogin(data: any): void {
    this.currentUser = new User(data.currentUser);
    this.loggedInSubject.next(true);
    localStorage.setItem('token', data.token);
  }

  private toUser(data: any): User {
    return new User(data.currentUser);
  }

  login(usernameOrEmail: string, password: string): Observable<User> {
    const body = {
      username_or_email: usernameOrEmail,
      password: password
    };

    return this.http.post<any>(`${HttpUtil.API_BASE_URL}/login`, body, this.httpConstants.httpOptions).pipe(
      tap(data => this.updateStateToLogin.call(this, data)),
      // mapTo(this.currentUser),
      map(this.toUser),
    );
  }

  logout(): void {
    this.currentUser = null;
    this.loggedInSubject.next(false);
    localStorage.removeItem('token');
  }

  isAdmin(): Observable<boolean> {
    return of(true);
  }
}
