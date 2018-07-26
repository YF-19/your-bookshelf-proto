import { Model } from './model';

export class User extends Model {

    username: string;
    email: string;
    name: string;
    bookshelfId: number;

    constructor(userData: any/*Partial<User>*/) {
        super(userData);
    }

    is(other: User) {
        return other && this.id === other.id;
    }

    update(user: User): void {
        Object.assign(this, user);
        // return this;
    }

    isAdmin(): boolean {
        return true;
    }
}
