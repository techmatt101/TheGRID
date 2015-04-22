import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

import Leaderboard = require('../models/Leaderboards/Leaderboard');

var ObjectId = mongoose.Schema.Types.ObjectId;

module LeaderboardsDbService {

    export interface ILeaderboardDoc extends mongoose.Document {
        name : string
        game : string
        scores? : IScoreDoc[]
    }

    export interface ILeaderboard {
        name? : string
        game? : string
        scores? : IScore[]
    }

    export interface IScoreDoc extends mongoose.Document {
        user : string
        username : string
        value : number
        date_achieved : Date
    }

    export interface IScore {
        user? : string
        username? : string
        value? : number
        date_achieved? : Date
    }

    var Schema = new mongoose.Schema({
        name: String,
        game: { type: ObjectId, ref: 'games' },
        scores: {
            select: false,
            type: [{
                user: { type: ObjectId, ref: 'users' },
                username: String,
                value: Number,
                date_achieved: Date
            }]
        }
    });

    var Model : mongoose.Model<ILeaderboardDoc> = mongoose.model<ILeaderboardDoc>('leaderboards', Schema);


    export function createLeaderboard (leaderboard : ILeaderboard) : Promise<ILeaderboardDoc> {
        return new Promise((resolve, reject) => {
            new Model(leaderboard).save((err, obj) => {
                if (err) reject(err);
                resolve(obj);
            });
        });
    }

    export function deleteLeaderboard (id : string) : Promise<ILeaderboardDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({ _id: id }).remove()
        );
    }

    export function getLeaderboard (id : string) : Promise<ILeaderboardDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({ _id: id })
        );
    }

    export function getLeaderboardWithScores (id : string) : Promise<ILeaderboardDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({ _id: id }).select('+scores')
        );
    }

    export function getLeaderboards (ids : string[]) : Promise<ILeaderboardDoc[]> {
        return DbHelpers.queryToPromise(
            Model.find({ _id: { $in: ids } })
        );
    }

    export function addScore (id : string, score : IScore) : Promise<ILeaderboardDoc[]> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $push: { scores: score } })
        );
    }

    export function updateScores (id : string, userId : string, value : number) : Promise<ILeaderboardDoc[]> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id, 'scores.user': userId }, { $set: { 'scores.$.value': value } })
        );
    }
}

export = LeaderboardsDbService;