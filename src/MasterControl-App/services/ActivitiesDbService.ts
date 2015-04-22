import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

import UsersDbService = require('./UsersDbService');

var ObjectId = mongoose.Schema.Types.ObjectId;

module ActivitiesDbService {
    export interface IActivityDoc extends mongoose.Document {
        user : UsersDbService.IUserDoc
        type : number
        message : string
        date_created : Date
        likes : string[]
        comments : ICommentDoc[]
    }

    export interface IActivity {
        user? : string
        type? : number
        message? : string
        date_created? : Date
        likes? : string[]
        comments? : string[]
    }

    export interface ICommentDoc extends mongoose.Document {
        user : UsersDbService.IUserDoc
        message : string
        date_created : Date
    }

    export interface IComment {
        user? : string
        message? : string
        date_created? : Date
    }

    var autoPopulate = function(next) {
        this.populate('users');
        next();
    };

    var Schema = new mongoose.Schema({
        user: { type: ObjectId, ref: 'users' },
        type: Number,
        message: String,
        date_created: Date,
        likes: [{ type: ObjectId, ref: 'users' }],
        comments: [{
            user: { type: ObjectId, ref: 'users' },
            message: String,
            date_created: Date
        }]
    })
        .pre('find', autoPopulate)
        .pre('findOne', autoPopulate);

    var Model : mongoose.Model<IActivityDoc> = mongoose.model<IActivityDoc>('activities', Schema);


    export function createActivity (activity : IActivity) : Promise<IActivityDoc> {
        return new Promise((resolve, reject) => {
            new Model(activity).save((err, obj) => {
                if (err) reject(err);
                resolve(obj);
            });
        });
    }

    export function getActivity (id : string) : Promise<IActivityDoc> {
        return DbHelpers.queryToPromise(Model.find({ _id: id }));
    }

    export function getActivitiesByUser (userIds : string[], maxResults = 10) : Promise<IActivityDoc[]> {
        return DbHelpers.queryToPromise(Model.find({ user: { $or: userIds }}).limit(maxResults).sort({ date_created : -1 }));
    }

    export function addLike (id : string, userId : string) : Promise<void> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $addToSet: { likes: userId } })
        );
    }

    export function removeLike (id : string, userId : string) : Promise<void> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $pull: { likes: userId } })
        );
    }

    export function addComment (id : string, comment : IComment) : Promise<void> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $push: { comments: comment } })
        );
    }
}

export = ActivitiesDbService;