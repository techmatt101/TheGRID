import LeaderboardsDb = require('../services/LeaderboardsDbService')
import Leaderboard = require('../models/Leaderboards/Leaderboard')
import Score = require('../models/Leaderboards/Score')

module LeaderboardsMapper {

    export function mapDbLeaderboardToLeaderboard (dbData : LeaderboardsDb.ILeaderboardDoc) : Leaderboard {
        return {
            name: dbData.name,
            scores: (dbData.scores) ? dbData.scores.map((score) => LeaderboardsMapper.mapDbScoreToScore(score)) : null
        };
    }

    export function mapDbScoreToScore (dbData : LeaderboardsDb.IScoreDoc) : Score {
        return {
            value : dbData.value,
            dateAchieved : dbData.date_achieved
        };
    }
}

export = LeaderboardsMapper;