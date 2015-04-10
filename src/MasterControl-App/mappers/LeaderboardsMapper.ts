import LeaderboardsDb = require('../services/LeaderboardsDbService')
import Leaderboard = require('../models/Leaderboard')

module LeaderboardsMapper {
    export function mapLeaderboard (dbData : LeaderboardsDb.ILeaderboard, leaderboard : Leaderboard) {
        leaderboard.name = dbData.name;
        leaderboard.scores = dbData.scores.map((score) => {
            return {
                value: score.score,
                dateAchieved: score.date_achieved
            }
        });

        return leaderboard;
    }
}

export = LeaderboardsMapper;