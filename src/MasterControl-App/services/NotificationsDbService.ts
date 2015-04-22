import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

import UsersDbService = require('./UsersDbService');

var ObjectId = mongoose.Schema.Types.ObjectId;

module NotificationsDbService {
    export interface INotificationDoc extends mongoose.Document {
        user : UsersDbService.IUserDoc
        type : number
        message : string
        date_created : Date
    }

    export interface INotification {
        user? : string
        type? : number
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
        date_created: Date
    })
        .pre('find', autoPopulate)
        .pre('findOne', autoPopulate);

    var Model : mongoose.Model<INotificationDoc> = mongoose.model<INotificationDoc>('notifications', Schema);


    export function createNotification (notification : INotification) : Promise<INotificationDoc> {
        return new Promise((resolve, reject) => {
            new Model(notification).save((err, obj) => {
                if (err) reject(err);
                resolve(obj);
            });
        });
    }

    export function getNotification (id : string) : Promise<INotificationDoc> {
        return DbHelpers.queryToPromise(
            Model.find({ _id: id })
        );
    }

    export function getNotificationsByUser (userId : string, maxResults = 10) : Promise<INotificationDoc[]> {
        return DbHelpers.queryToPromise(
            Model.find({ users: userId }).limit(maxResults)
        );
    }
}

export = NotificationsDbService;