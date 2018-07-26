import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private _messages$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() { }

  get messages$(): Observable<string[]> {
    return this._messages$;
  }

  showMessage(message: string): void {
    this._messages$.next([message]);
  }

  showMessages(messages: string[]): void {
    this._messages$.next(messages);
  }
}
