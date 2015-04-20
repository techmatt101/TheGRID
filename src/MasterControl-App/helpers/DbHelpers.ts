import mongoose = require('mongoose');

module DbHelpers {
    export function queryToPromise (promise : mongoose.Query<any>) : Promise<any|void> {
        return new Promise((resolve, reject) => promise.exec((err, x) => {
            if(err) reject(err);
            resolve(x);
        }));
    }
}

export = DbHelpers;