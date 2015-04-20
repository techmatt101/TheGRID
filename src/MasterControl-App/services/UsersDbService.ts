import mongoose = require('mongoose');

import UsersMapper = require('../mappers/UsersMapper');

var ObjectId = mongoose.Schema.Types.ObjectId;

module UsersDbService {

    export interface IUserDoc extends IUser, mongoose.Document {}
    export interface IUser {
        username : string
        full_name : string
        email : string
        password : string
        date_created : Date
        developer : boolean
        friends: string[]
    }

    var Schema = new mongoose.Schema({
        username: { type: String, unique: true },
        email: { type: String, unique: true },
        password: String,
        full_name: String,
        date_created: Date,
        developer: Boolean,
        friends: [{ type: ObjectId, ref: 'users' }]
    });

    var Model : mongoose.Model<IUserDoc> = mongoose.model<IUserDoc>('users', Schema);


    export function createUser (user : IUser) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            new Model(user).save((err) => {
                if (err) reject(err);
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
        return queryToPromise(Model.update({ _id: id }, { $set: user })); //TODO: hmmm...
    }

    export function addFriend (id : string, friendId : string) : Promise<IUserDoc> {
        return queryToPromise(Model.update({ _id: id }, { $addToSet: { friends: friendId } }));
    }

    export function removeFriend (id : string, friendId : string) : Promise<IUserDoc> {
        return queryToPromise(Model.update({ _id: id }, { $pull: { friends: friendId } }));
    }
}

function queryToPromise (promise : mongoose.Query<any>) {
    return new Promise((resolve, reject) => promise.exec((err, x) => {
        if(err) reject(err);
        resolve(x);
    }));
}

export = UsersDbService;
