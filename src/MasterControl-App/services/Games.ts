import mongoose = require('mongoose');
//import Users = require('./Users');
import Leaderboards = require('./Leaderboards');

var ObjectId = mongoose.Schema.Types.ObjectId;

module Games {
    export interface IGame extends mongoose.Document {
        name: string
        leaderboards: Leaderboards.ILeaderboard[]
        //developers: Users.IUser[]
    }

    export var Schema = new mongoose.Schema({
        name: String,
        leaderboards: [{ type: ObjectId, ref: 'leaderboards'}],
        //developers: [{ type: ObjectId, ref: 'users'}]
    });

    export var Model : mongoose.Model<IGame> = mongoose.model<IGame>('games', Schema);


    export function getList(callback : (err, games : IGame[]) => void) {
        return Model.find({}).populate('leaderboards').populate('developers').exec(callback);
    }
}

export = Games;