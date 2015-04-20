import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

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
        return DbHelpers.queryToPromise(
            Model.find({})
        );
    }

    export function getUserById (id : string) : Promise<IUserDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({ _id: id })
        );
    }

    export function getUserByUsername (username : string) : Promise<IUserDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({ username: username })
        );
    }

    export function getUserByEmail (email : string) : Promise<IUserDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({ email: email })
        );
    }

    export function updateUser (id : string, user : IUser) : Promise<void> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $set: user }) //TODO: hmmm...
        );
    }

    export function addFriend (id : string, friendId : string) : Promise<void> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $addToSet: { friends: friendId } })
        );
    }

    export function removeFriend (id : string, friendId : string) : Promise<void> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $pull: { friends: friendId } })
        );
    }
}

export = UsersDbService;
