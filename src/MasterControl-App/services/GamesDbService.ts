import mongoose = require('mongoose');
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


    export function getList () : mongoose.Promise<IGame[]> {
        return Model.find({}).populate('leaderboards').exec();
    }
}

export = GamesDbService;