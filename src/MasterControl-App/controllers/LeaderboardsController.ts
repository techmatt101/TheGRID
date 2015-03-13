import Leaderboards = require('../modules/Leaderboards');

module LeaderboardsController {

    export module Scores {

        export var PATH = 'leaderboards/scores';

        export interface Data {
            id : number
        }

        export interface Return {
            scores : any[]
        }

        export function handler(reply : SocketRouter.Reply<Return>, data : Data) {
            Leaderboards.getScoreList(data.id, (err, leaderboard) => {
                if (err) reply.error(err);
                reply({
                    scores: leaderboard.scores
                });
            });
        }
    }
}

export = LeaderboardsController;