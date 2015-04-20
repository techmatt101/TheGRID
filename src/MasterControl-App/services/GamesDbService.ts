import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

import Leaderboards = require('./LeaderboardsDbService');

var ObjectId = mongoose.Schema.Types.ObjectId;

module GamesDbService {
    export interface IGame extends mongoose.Document {
        name : string
        leaderboards : Leaderboards.ILeaderboard[]
    }

    var Schema = new mongoose.Schema({
        name: String,
        leaderboards: [{ type: ObjectId, ref: 'leaderboards' }]
    });

    var Model : mongoose.Model<IGame> = mongoose.model<IGame>('games', Schema);


    export function getList () : Promise<IGame[]> {
        return DbHelpers.queryToPromise(
            Model.find({}).populate('leaderboards')
        );
    }
}

export = GamesDbService;