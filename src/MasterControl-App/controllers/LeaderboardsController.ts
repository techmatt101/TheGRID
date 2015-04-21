import LeaderboardsDb = require('../services/LeaderboardsDbService');
import LeaderboardsMapper = require('../mappers/LeaderboardsMapper');
import Leaderboard = require('../models/Leaderboards/Leaderboard');
import Score = require('../models/Leaderboards/Score');

module LeaderboardsController {

    export module Scores {

        export var PATH = 'leaderboards/scores';

        export interface Data {
            id : number
        }

        export interface Return {
            scores : Score[]
        }

        export function handler (data : Data) : Promise<Return> {
            return LeaderboardsDb.getScoreList(data.id)
                .then((leaderboardData) => {
                    var leaderboard = LeaderboardsMapper.mapLeaderboard(leaderboardData, new Leaderboard());
                    return {
                        scores: leaderboard.scores
                    };
                });
        }
    }
}

export = LeaderboardsController;