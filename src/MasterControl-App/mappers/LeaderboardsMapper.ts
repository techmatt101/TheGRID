import LeaderboardsDb = require('../services/LeaderboardsDbService')
import Leaderboard = require('../models/Leaderboards/Leaderboard')
import NewLeaderboard = require('../models/Leaderboards/NewLeaderboard')
import Score = require('../models/Leaderboards/Score')
import NewScore = require('../models/Leaderboards/NewScore')
import User = require('../models/Users/User')

module LeaderboardsMapper {

    export function mapDbLeaderboardToLeaderboard (dbData : LeaderboardsDb.ILeaderboardDoc) : Leaderboard {
        return {
            id: dbData._id,
            name: dbData.name,
            gameId: dbData.game,
            scores: (dbData.scores) ? dbData.scores.map((score) => LeaderboardsMapper.mapDbScoreToScore(score)) : null
        };
    }

    export function mapNewLeaderboardToDbLeaderboard (newLeaderboard : NewLeaderboard) : LeaderboardsDb.ILeaderboard {
        return {
            name: newLeaderboard.name,
            game: newLeaderboard.gameId,
            scores: []
        };
    }

    export function mapDbScoreToScore (dbData : LeaderboardsDb.IScoreDoc) : Score {
        return {
            userId : dbData.user,
            username : dbData.username,
            value : dbData.value,
            dateAchieved : dbData.date_achieved
        };
    }

    export function mapNewScoreToDbScore (newScore : NewScore, user : User) : LeaderboardsDb.IScore {
        return {
            user : user.id,
            username : user.username,
            value : newScore.value,
            date_achieved : new Date()
        };
    }
}

export = LeaderboardsMapper;