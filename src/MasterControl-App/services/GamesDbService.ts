import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

import LeaderboardsDb = require('./LeaderboardsDbService');
import UsersDb = require('./UsersDbService');

var ObjectId = mongoose.Schema.Types.ObjectId;

module GamesDbService {

    export interface IGameDoc extends mongoose.Document {
        name : string
        published : boolean
        poster : string
        description : string
        url : string
        categories : number[]
        leaderboards : LeaderboardsDb.ILeaderboardDoc[]
        developer : UsersDb.IUserDoc
    }

    export interface IGame {
        name? : string
        published? : boolean
        poster? : string
        description? : string
        url? : string
        categories? : number[]
        leaderboards? : string[]
        developer? : string
    }

    var autoPopulate = function(next) {
        this.populate('users');
        this.populate('leaderboards');
        next();
    };

    var Schema = new mongoose.Schema({
        name: String,
        published: Boolean,
        poster: String,
        description: String,
        url: String,
        categories: Array,
        leaderboards: [{ type: ObjectId, ref: 'leaderboards' }],
        developer: { type: ObjectId, ref: 'users' }
    })
        .pre('find', autoPopulate)
        .pre('findOne', autoPopulate);

    var Model : mongoose.Model<IGameDoc> = mongoose.model<IGameDoc>('games', Schema);


    export function createGame (game : IGame) : Promise<IGameDoc> {
        return new Promise((resolve, reject) => {
            new Model(game).save((err, obj) => {
                if (err) reject(err);
                resolve(obj);
            });
        });
    }

    export function deleteGame (id : string) : Promise<IGameDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({ _id: id }).remove()
        );
    }

    export function getGame (id : string) : Promise<IGameDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({ _id: id })
        );
    }

    export function getGames (ids : string[]) : Promise<IGameDoc[]> {
        return DbHelpers.queryToPromise(
            Model.find({ _id: { $in: ids } })
        );
    }

    export function searchPublishedGames (search : string, maxResults = 10) : Promise<IGameDoc[]> {
        return DbHelpers.queryToPromise(
            Model.find({ name: { $regex: new RegExp(search, 'i') }, published: true }).limit(maxResults)
        );
    }

    export function updateGame (id : string, game : IGame) : Promise<void> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $set: game })
        );
    }

    export function addLeaderboard (id : string, leaderboardId : string) : Promise<IGameDoc> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $addToSet: { leaderboards: leaderboardId } })
        );
    }

    export function removeLeaderboard (id : string, leaderboardId : string) : Promise<IGameDoc> {
        return DbHelpers.queryToPromise(
            Model.update({ _id: id }, { $pull: { leaderboards: leaderboardId } })
        );
    }
}

export = GamesDbService;