import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { Observable, Subject, of, fromEvent, iif } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, merge, tap, takeWhile, scan, filter, expand, delay, map } from 'rxjs/operators';

import * as _ from 'lodash';

import { Book } from '../models/book';
import { BookService } from '../services/book.service';
import { MessageService } from '../services/message.service';

// TODO: ある程度の高さがあるFooterを用意すると一番下までスクロールしても流れなくなる（閾値の調整が必要）
// TODO: 最下部にスクロールして、その後すぐに上下にスクロールし続けるとスクロールを止めるまで流れない
// TODO: CSSでメインコンテンツの高さをイジると検索の挙動がおかしくなる
// TODO: popular表示中でもこのストリームが流れてしまう -> Done
// TODO: スクロール可能なページ数が流れても、+1ページ余分に流れてしまっている（Scrollableの更新が間に合ってない） -> Done
@Component({
  selector: 'app-book-library',
  templateUrl: './book-library.component.html',
  styleUrls: ['./book-library.component.css']
})
export class BookLibraryComponent implements OnInit, AfterViewChecked {

  books: Book[] = [];
  loading = false;  // プログレスバーの表示・非表示をコントロールする
  private searchTerms = new Subject<string>();
  private searchTerm = '';    // 現在の検索ワード
  private readonly limit = 6; // 1ページ（無限スクロールにおける1回の取得）あたりの最大件数
  private scrollable = false; // 垂直方向へのスクロール可否状態を表す
  private completed = true;   // 検索結果をすべて取得完了したかを表す
  private activetedInfiniteScroll = true; // 無限スクロールのObservableを制御する要素の1つ

  constructor(private bookService: BookService, private messageService: MessageService) { }

  // インクリメンタルサーチと無限スクロール
  ngOnInit() {
    // はじめは人気のある本を表示する
    this.showPopularBooks();

    // 検索ワードが流れるObservable（Subject）
    // 変化があった場合に値が流れて、そのときに各種プロパティをセット・リセットする
    const terms$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(newTerm => this.presetForSearch(newTerm)),
    );

    // 検索ワードが変更されるたびに検索結果の先頭からスクロール可能になるまでのページが流れるObservable
    const headResults$ = this.createHeadResults$(terms$);

    // ページ最下部にスクロールするたびに残りの検索結果が流れるObservable
    const restResults$ = this.createRestResults$();

    // headはスクロール可能になるまで流れ、その後restが流れる
    const searchResults$ = headResults$.pipe(merge(restResults$));
    searchResults$.subscribe(
      (books: Book[]) => {
        if (!_.isEmpty(books)) {
          this.appendBooksToResults(books);
        }
        this.completed = this.completed || this.isCompleted(books);
        this.hideLoading();
      },
      error => {
        this.messageService.showMessage(error.message);
        this.hideLoading();
      }
    );
  }

  private showPopularBooks(): void {
    this.showLoading();
    this.bookService.getPopularBooks().subscribe(
      books => {
        this.books = books;
        this.hideLoading();
      },
      error => {
        this.messageService.showMessage(error.message);
        this.hideLoading();
      }
    );
  }

  private showLoading(): void {
    this.loading = true;
  }

  private hideLoading(): void {
    this.loading = false;
  }

  // 検索前の準備として各種プロパティをセット・リセットする
  private presetForSearch(newTerm: string): void {
    this.books = [];
    this.hideLoading();
    this.searchTerm = newTerm;
    this.completed = false;
    this.activetedInfiniteScroll = false;
  }

  private createHeadResults$(terms$: Observable<string>): Observable<Book[] | boolean> {
    return terms$.pipe(
      tap(newTerm => this.showLoading()),
      switchMap(newTerm => this.bookService.searchBooks({ term: this.searchTerm, limit: this.limit, offset: 0 }).pipe(
        // iifの前にtapとdelayが必要なので仮の適当なオブザーバブルを使っている
        // timerにすることでdelayを削除できるかと思ったが、loading表示の前に遅延させてしまうと表示に違和感があったので、loadingの後ろでdelayしている
        expand(books => of([])/*timer(1)*/.pipe(
          tap(() => this.showLoading()),
          delay(100), // この遅延がないとScrollableの更新が間に合わないので、スクロール可能な最低ページ数より+1ページ多く取ってきてしまう
          switchMap(() => iif(
            () => !this.completed && !this.scrollable,
            this.bookService.searchBooks({ term: this.searchTerm, limit: this.limit, offset: this.books.length }),
            of(false))  // expandの終了条件の値で最後に必ずここを通る
          ),
          tap(data => {
            if (!data) {
              this.activetedInfiniteScroll = true;
              this.hideLoading();  // ここに書かないとLoadingが表示されたままのケースがあった
            }
          }),
          takeWhile((data: Book[] | boolean) => !!data) // booleanタイプは流れない
        )),
      )),
    );
  }

  // 最下部にスクロールするたびに残りの検索結果を取得するObservableを返す
  private createRestResults$(): Observable<Book[]> {
    return fromEvent(window, 'scroll').pipe(
      filter(ev => this.activetedInfiniteScroll && !this.completed),      // 先頭付近の検索結果が流れ終わるまではフィルタリングする
      // 以下の処理はスクロール方向を判定するために必要
      map(ev => window.pageYOffset),
      scan((scroll: { start: number, end: number }, current: number) => { // スクロール前後のスクロールバーの位置
        return { start: scroll.end, end: current };
      }, { start: 0, end: window.pageYOffset }),
      filter(this.isScrollingDown),                 // 今後、パスする条件を最下部ではなくより範囲を広げたときにスクロールアップで流れることを防ぐことが目的
      filter(scroll => this.isReachedBottom()),
      tap(scroll => this.showLoading()),
      switchMap(scroll => this.bookService.searchBooks({ term: this.searchTerm, limit: this.limit, offset: this.books.length })),
      // debounceTime(500),
    );
  }

  // 下方向へのスクロールかどうかをブールで返す
  private isScrollingDown(scroll: { start: number, end: number }): boolean {
    return scroll.end > scroll.start;
  }

  // ページ最下部にスクロールした状態かをブールで返す
  private isReachedBottom(): boolean {
    // 閾値が0だと最下部までスクロールしても、それを検知できないケースを確認（Footerのデザインが影響している）
    // 閾値は要調整
    return document.body.offsetHeight - (window.pageYOffset + window.innerHeight) <= 1;
  }

  // いままでの検索結果の末尾に新たな結果を追加する
  private appendBooksToResults(books: Book[]): void {
    this.books = this.books.concat(books);
  }

  // 現在の検索ワードにヒットする本をすべて取得完了したかをブールで返す
  private isCompleted(books: Book[]) {
    return _.isEmpty(books) || books.length < this.limit || _.last(books).isUnavailable();
  }

  // ビュー変更時に都度スクロール可否状態を確認する
  ngAfterViewChecked(): void {
    this.scrollable = this.canScrollVertically();
  }

  // 垂直方向へのスクロール可否をブールで返す
  private canScrollVertically(): boolean {
    return document.body.offsetHeight > window.innerHeight;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
