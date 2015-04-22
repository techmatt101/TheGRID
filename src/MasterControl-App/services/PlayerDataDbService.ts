import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

import UsersDbService = require('./UsersDbService');
import GamesDbService = require('./GamesDbService');
import LeaderboardsDbService = require('./LeaderboardsDbService');

var ObjectId = mongoose.Schema.Types.ObjectId;

module PlayerDataDbService {

    export interface IPlayerDataDoc extends mongoose.Document {
        user : UsersDbService.IUserDoc
        games : GamesDbService.IGameDoc[]
        scores : IPlayerScoreDoc[]
    }

    export interface IPlayerData {
        user? : string
        games? : string
        scores? : IPlayerScore[]
    }

    export interface IPlayerScoreDoc extends mongoose.Document {
        game : GamesDbService.IGameDoc
        leaderboard : LeaderboardsDbService.ILeaderboardDoc
        value : number
        date_achieved : Date
    }

    export interface IPlayerScore {
        game? : string
        leaderboard? : string
        value? : number
        date_achieved? : Date
    }

    var Schema = new mongoose.Schema({
        user: { type: ObjectId, ref: 'users' },
        type: Number,
        message: String,
        date_created: Date
    });

    var Model : mongoose.Model<IPlayerDataDoc> = mongoose.model<IPlayerDataDoc>('player_data', Schema);


    export function newPlayerData (notification : IPlayerData) : Promise<IPlayerDataDoc> {
        return new Promise((resolve, reject) => {
            new Model(notification).save((err, obj) => {
                if (err) reject(err);
                resolve(obj);
            });
        });
    }

    export function getNotification (id : string) : Promise<IPlayerDataDoc> {
        return DbHelpers.queryToPromise(
            Model.find({ _id: id })
        );
    }
}

export = PlayerDataDbService;