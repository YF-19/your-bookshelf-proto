import { Model } from './model';
import { User } from './user';
import { Book } from './book';

export class Review extends Model {

    rating: number;
    body: string;
    // book: Book;
    writer: User;

    constructor(reviewData: any/*Partial<Review>*/) {
        super(reviewData, Model.blacklistFilter(['writer']));

        this.writer = reviewData.writer ? new User(reviewData.writer) : null;
    }

    // 最初の投稿が完了しているかをブールで返す
    isDoneFirstPost(): boolean {
        // idに0がくることはないはずだが、念の為考慮しておく
        return this.id === 0 || !!this.id;
    }

    isWrittenBy(user: User): boolean {
        return this.writer.is(user);
    }
}
