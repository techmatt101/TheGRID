import mongoose = require('mongoose');

import UsersMapper = require('../mappers/UsersMapper');

module UsersDbService {

    export interface IUserDoc extends IUser, mongoose.Document {}
    export interface IUser {
        username : string
        full_name : string
        email : string
        password : string
        date_created : Date
        developer : boolean
    }

    var Schema = new mongoose.Schema({
        username: String,
        full_name: String,
        email: String,
        password: String,
        date_created: Date,
        developer: Boolean
    });

    var Model : mongoose.Model<IUserDoc> = mongoose.model<IUserDoc>('users', Schema);


    export function createUser (user : IUser) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            new Model(user).save((err) => {
                if(err) reject(err);
                resolve();
            });
        });
    }

    export function getUsers () : Promise<IUserDoc[]> {
        return queryToPromise(Model.find({}));
    }

    export function getUserById (id : string) : Promise<IUserDoc> {
        return queryToPromise(Model.findOne({ _id: id }));
    }

    export function getUserByUsername (username : string) : Promise<IUserDoc> {
        return queryToPromise(Model.findOne({ username: username }));
    }

    export function getUserByEmail (email : string) : Promise<IUserDoc> {
        return queryToPromise(Model.findOne({ email: email }));
    }

    export function updateUser (id : string, user : IUser) : Promise<IUserDoc> {
        return queryToPromise(Model.update({ _id: id }, user));
    }
}

function queryToPromise (promise : mongoose.Query<any>) {
    return new Promise((resolve, reject) => promise.exec().then((x) => resolve(x)).error((x) => reject(x)));
}

export = UsersDbService;
