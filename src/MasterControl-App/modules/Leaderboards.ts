import mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

module Leaderboards {
    export interface ILeaderboard extends mongoose.Document {
        name: string
        scores: Object[]
    }

    export var Schema = new mongoose.Schema({
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
            date_achieved : Date
        }]
    });

    export var Model : mongoose.Model<ILeaderboard> = mongoose.model<ILeaderboard>('leaderboards', Schema);


    export function getScoreList(id : number, callback : (err, leaderboards : ILeaderboard) => void) {
        return Model.findOne({ id: id }).exec(callback);
    }
}

export = Leaderboards;