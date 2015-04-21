import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

import UsersMapper = require('../mappers/UsersMapper');

var ObjectId = mongoose.Schema.Types.ObjectId;

module UsersDbService {

    export interface IUserDoc extends mongoose.Document {
        username : string
        full_name : string
        email : string
        password? : string
        date_created : Date
        developer : boolean
        friends: string[]
    }

    export interface IUser {
        username? : string
        full_name? : string
        email? : string
        password? : string
        date_created? : Date
        developer? : boolean
        friends?: string[]
    }

    var Schema = new mongoose.Schema({
        username: { type: String, unique: true },
        email: { type: String, unique: true },
        password: { type: String, select: false },
        full_name: String,
        date_created: Date,
        developer: Boolean,
        friends: [{ type: ObjectId, ref: 'users' }]
    });

    var Model : mongoose.Model<IUserDoc> = mongoose.model<IUserDoc>('users', Schema);


    export function createUser (user : IUser) : Promise<IUserDoc> {
        return new Promise((resolve, reject) => {
            new Model(user).save((err, obj) => {
                if (err) reject(err);
                resolve(obj);
            });
        });
    }

    export function getUsers (ids : string[]) : Promise<IUserDoc[]> {
        return DbHelpers.queryToPromise(
            Model.find({ _id: { $in: ids } })
        );
    }

    export function searchUsers (search : string, maxResults = 10) : Promise<IUserDoc[]> {
        var regex = new RegExp(search, 'i');
        return DbHelpers.queryToPromise(
            Model.find({ $or: [
                { username: { $regex: regex } },
                { full_name: { $regex: regex } },
                { email: { $regex: regex } }
            ]}).limit(maxResults)
        );
    }

    export function getUserById (id : string) : Promise<IUserDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({ _id: id })
        );
    }

    export function getUserByUsername (username : string, includePassword = false) : Promise<IUserDoc> {
        var query = Model.findOne({ username: username });
        if(includePassword) query.select('password');
        return DbHelpers.queryToPromise(query);
    }

    export function getUserByEmail (email : string, includePassword = false) : Promise<IUserDoc> {
        var query = Model.findOne({ email: email });
        if(includePassword) query.select('password');
        return DbHelpers.queryToPromise(query);
    }

    export function updateUser (id : string, user : IUser) : Promise<IUserDoc> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $set: user })
        );
    }

    export function addFriend (id : string, friendId : string) : Promise<IUserDoc> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $addToSet: { friends: friendId } })
        );
    }

    export function removeFriend (id : string, friendId : string) : Promise<IUserDoc> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $pull: { friends: friendId } })
        );
    }
}

export = UsersDbService;
