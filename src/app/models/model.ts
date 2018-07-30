import * as _ from 'lodash';

export class Model {

    id: number;
    createdAt: string | Date;
    updatedAt: string | Date;

    // サブクラスのプロパティのうち、型がModelのものはサブクラスのコンストラクタ内で個別に初期化すること
    // ここのコンストラクタで初期化する（もしくは初期化しない）プロパティはfilter関数で指定する（blacklistFilter, whitelistFilterを利用する）
    constructor(data?: /*Partial<Model>*/any, filter?: (props: string[]) => string[]) {
        const fullProps = data ? Object.getOwnPropertyNames(data) : [];
        const targetProps = filter ? filter(fullProps) : fullProps;

        targetProps.forEach(prop => this[prop] = data[prop]);

        // this.initializeModelTypeProperties();
    }

    static propertiesFilter(predicate: (prop: string) => boolean): (props: string[]) => string[] {
        return (props: string[]) => {
            return props.filter(predicate);
        };
    }

    // deselect
    static blacklistFilter(blacklist: string[]): (props: string[]) => string[] {
        return Model.propertiesFilter((p: string) => !blacklist.includes(p));
    }

    // select
    static whitelistFilter(whitelist: string[]): (props: string[]) => string[] {
        return Model.propertiesFilter((p: string) => whitelist.includes(p));
    }

    static toAttributes(obj: any, options?: any): any {
        const fullProps = Object.getOwnPropertyNames(obj);
        const targetProps = options && options.filter ? options.filter(fullProps) : fullProps;
        const converter = options && options.converter ? options.converter : _.identity;

        return targetProps.reduce((attrs, prop) => {
            const convertedProp = converter(prop);
            const val = obj[prop];

            if (Array.isArray(val)) {
                attrs[convertedProp] = Model.toAttributesForArray(val, converter);
            } else if (val instanceof Model) {
                attrs[convertedProp] = val.toAttributes({ converter });
            } else if (_.isPlainObject(val)) {
                attrs[convertedProp] = Model.toAttributes(val, { converter });
            } else {
                attrs[convertedProp] = val;
            }

            return attrs;
        }, {});
    }

    private static toAttributesForArray(array: Array<any>, converter?: (prop: string) => string ): Array<any> {
        return array.map(el => {
            if (Array.isArray(el)) {
                return Model.toAttributesForArray(el, converter);
            } else if (el instanceof Model) {
                return el.toAttributes({ converter });
            } else if (_.isPlainObject(el)) {
                return Model.toAttributes(el, { converter });
            } else {
                return el;
            }
        });
    }

    // protected initializeModelTypeProperties(): void {
    // }

    // モデルのデータだけをハッシュにして返す
    // filter, converter
    toAttributes(options?: { filter?: (props: string[]) => string[], converter?: (prop: string) => string }): any {
        return Model.toAttributes(this, options);
    }

    toSnakeCaseAttributes(filter?: (props: string[]) => string[]): any {
        return this.toAttributes({ filter, converter: _.snakeCase });
    }

    // モデルのディープクローンを生成する
    clone<T extends Model>(filter?: (props: string[]) => string[]): T {
        return new (<any>this.constructor)(this.toAttributes({ filter }));
    }
}
