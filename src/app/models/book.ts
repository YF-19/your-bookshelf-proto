import * as _ from 'lodash';

import { BookStatus } from '../enums/book-status.enum';
import { User } from './user';
import { Model } from './model';

export class Book extends Model {

    isbn: string;
    title: string;
    subtitle: string;
    authors: string[];
    publisher: string;
    publishedDate: Date | string;
    description: string;
    pageCount: number;
    thumbnailUrl: string;
    status: BookStatus;
    storedCount: number;

    owner: User;
    isOwnedByCurrentUser: boolean;

    constructor(bookData: any/*Partial<Book>*/) {
        super(bookData, Model.blacklistFilter(['owner']));

        this.owner = bookData.owner ? new User(bookData.owner) : null;
    }

    isUnavailable(): boolean {
        return this.status === BookStatus.Unavailable;
    }

    isRequested(): boolean {
        return this.status === BookStatus.Requested;
    }

    isAvailable(): boolean {
        return this.status === BookStatus.Available;
    }

    isOwnedBy(user: User): boolean {
        return user && this.owner && user.is(this.owner);
    }

    reject(): void {
        this.status = BookStatus.Unavailable;
    }

    // （手にとった本は）誰かに所有されているか？
    belongsToSomeone(): boolean {
        return !!this.owner;
    }

    // （手にとった本は）ユーザーに所有されているか？
    belongsTo(user: User): boolean {
        return this.belongsToSomeone() && this.owner.is(user);
    }
}
