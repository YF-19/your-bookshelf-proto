import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, pipe, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { HTTP_CONSTANTS } from '../constants/http-constants';
import { HttpUtil } from '../utils/http-util';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly userUrl = HttpUtil.API_BASE_URL + '/users';

  constructor(
    @Inject(HTTP_CONSTANTS) private httpConstants: any,
    private http: HttpClient
  ) { }

  createUser(username: string, email: string, password: string): Observable<any> {
    const body = {
      user: { username, email, password }
    };

    return this.http.post<any>(this.userUrl, body, HttpUtil.makeHttpOptions());
  }

  updateUser(user: User, filter?: (props: string[]) => string[]): Observable<User> {
    const body = { user: user.toSnakeCaseAttributes(filter) };

    return this.http.put(`${this.userUrl}/${user.id}`, body, HttpUtil.makeHttpOptions()).pipe(
      map<any, User>(data => new User(data.updatedUser))
    );
  }

  deleteUser(user: User): Observable<any> {
    return this.http.delete(`${this.userUrl}/${user.id}`, HttpUtil.makeHttpOptions());
  }
}
