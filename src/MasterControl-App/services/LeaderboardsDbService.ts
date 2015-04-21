import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

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
                users: { type: ObjectId, ref: 'users' },
                username: String,
                value: Number,
                date_achieved: Date
            }]
        }
    });

    var Model : mongoose.Model<ILeaderboardDoc> = mongoose.model<ILeaderboardDoc>('leaderboards', Schema);


    export function getScoreList (id : number) : Promise<ILeaderboardDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({ id: id })
        );
    }
}

export = LeaderboardsDbService;