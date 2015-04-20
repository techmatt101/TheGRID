import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

var ObjectId = mongoose.Schema.Types.ObjectId;

module LeaderboardsDbService {
    export interface ILeaderboard extends mongoose.Document {
        name : string
        scores : IScore[]
    }

    export interface IScore {
        score : number
        date_achieved : Date
    }

    var Schema = new mongoose.Schema({
        id: Number,
        name: String,
        scores: [{
            //type: ObjectId,
            //ref: 'user'
            //user_id : {
            //    type: ObjectId,
            //    ref: 'user_id'
            //},
            score: Number,
            date_achieved: Date
        }]
    });

    var Model : mongoose.Model<ILeaderboard> = mongoose.model<ILeaderboard>('leaderboards', Schema);


    export function getScoreList (id : number) : Promise<ILeaderboard> {
        return DbHelpers.queryToPromise(
            Model.findOne({ id: id })
        );
    }
}

export = LeaderboardsDbService;