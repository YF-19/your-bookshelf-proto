import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';

import * as M from 'materialize-css';

import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit {

  messages: string[];
  modal: any;

  constructor(private messageService: MessageService, private renderer: Renderer2) { }

  ngOnInit() {
    this.messageService.messages$.subscribe(
      messages => this.show.call(this, messages)
    );
  }

  ngAfterViewInit() {
    this.modal = M.Modal.init(document.getElementById('modal_messenger'));
  }

  show(messages: string[]): void {
    this.messages = messages;

    // 初期化前にshowが呼び出されてしまうため、このifは必要
    if (this.modal) {
      this.modal.open();
    }
  }

  hide(): void {
    this.messages = null;
  }
}
