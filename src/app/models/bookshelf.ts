import { Model } from './model';
import { Book } from './book';
import { User } from './user';

export class Bookshelf extends Model {

    books: Book[];
    owner: User;
    private _booksCount: number;

    constructor(data: any/*Partial<Bookshelf>*/) {
        super(data, Model.blacklistFilter(['books', 'owner']));

        this.books = Array.isArray(data.books) ? data.books.map(bookData => new Book(bookData)) : null;
        this.owner = new User(data.owner);
    }

    get booksCount(): number {
        return Array.isArray(this.books) ? this.books.length : this._booksCount;
    }
    set booksCount(val: number) {
        this._booksCount = val;
    }
}
