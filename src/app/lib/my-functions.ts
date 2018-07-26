
export const def = {

    existy: function(val: any): boolean {
        return !(val === undefined || val === null);
    },

    not: function(predicate: () => boolean): () => boolean {
        return (...args) => {
            return !predicate.apply(null, args);
        };
    }
};
