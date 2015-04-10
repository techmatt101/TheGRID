import LeaderboardsDb = require('../services/LeaderboardsDbService');
import LeaderboardsMapper = require('../mappers/LeaderboardsMapper');
import Leaderboard = require('../models/Leaderboard');
import Score = require('../models/Score');

module LeaderboardsController {

    export module Scores {

        export var PATH = 'leaderboards/scores';

        export interface Data {
            id : number
        }

        export interface Return {
            scores : Score[]
        }

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            LeaderboardsDb.getScoreList(data.id)
                .then((leaderboardData) => {
                    var leaderboard = LeaderboardsMapper.mapLeaderboard(leaderboardData, new Leaderboard());
                    reply({
                        scores: leaderboard.scores
                    });
                })
                .error((err) => reply.error(err));
        }
    }
}

export = LeaderboardsController;