import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

var ObjectId = mongoose.Schema.Types.ObjectId;

module PlayerDataDbService {

    export interface IPlayerDataDoc extends mongoose.Document {
        user : string
        games : string[]
        scores : IPlayerScoreDoc[]
    }

    export interface IPlayerData {
        user? : string
        games? : string[]
        scores? : IPlayerScore[]
    }

    export interface IPlayerScoreDoc extends mongoose.Document {
        game : string
        leaderboard : string
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
        games: [{ type: ObjectId, ref: 'games' }],
        scores: [{
            game: { type: ObjectId, ref: 'games' },
            leaderboard: { type: ObjectId, ref: 'leaderboards' },
            value: Number,
            date_achieved: Date
        }]
    });

    var Model : mongoose.Model<IPlayerDataDoc> = mongoose.model<IPlayerDataDoc>('players', Schema);


    export function newPlayerData (newPlayerData : IPlayerData) : Promise<IPlayerDataDoc> {
        return new Promise((resolve, reject) => {
            new Model(newPlayerData).save((err, obj) => {
                if (err) reject(err);
                resolve(obj);
            });
        });
    }

    export function getPlayerData (userId : string) : Promise<IPlayerDataDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({ user: userId })
        );
    }

    export function addScore (userId : string, score : IPlayerScore) : Promise<IPlayerDataDoc[]> {
        return DbHelpers.queryToPromise(
            Model.update({ user: userId}, { $push: { scores: score } })
        );
    }

    export function updateScores (userId : string, leaderboardId : string, value : number) : Promise<IPlayerDataDoc[]> {
        return DbHelpers.queryToPromise(
            Model.update({ user: userId, 'scores.leaderboard': leaderboardId }, { $set: { 'scores.$.value': value } })
        );
    }
}

export = PlayerDataDbService;