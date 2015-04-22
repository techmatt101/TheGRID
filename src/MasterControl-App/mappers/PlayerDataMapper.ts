import PlayerDataDb = require('../services/PlayerDataDbService')
import PlayerData = require('../models/PlayerData/PlayerData')
import PlayerScore = require('../models/PlayerData/PlayerScore')

module PlayerDataMapper {

    export function mapNewPlayerDataToDbPlayerData (userId : string) : PlayerDataDb.IPlayerData {
        return {
            user: userId,
            games: [],
            scores: []
        };
    }

    export function mapNewPlayerScoreToDbPlayerScore (gameId : string, leaderboardId : string, value : number) : PlayerDataDb.IPlayerScore {
        return {
            gameId : gameId,
            leaderboardId : leaderboardId,
            value : value,
            dateAchieved : new Date()
        };
    }

    export function mapDbPlayerDataToPlayerData (dbData : PlayerDataDb.IPlayerDataDoc) : PlayerData {
        return {
            gameIds: dbData.games,
            scores: dbData.scores.map((score) => PlayerDataMapper.mapDbPlayerScoreToPlayerScore(score))
        };
    }

    export function mapDbPlayerScoreToPlayerScore (dbData : PlayerDataDb.IPlayerScoreDoc) : PlayerScore {
        return {
            gameId: dbData.game,
            leaderboardId : dbData.leaderboard,
            value : dbData.value,
            dateAchieved : dbData.date_achieved
        };
    }
}

export = PlayerDataMapper;