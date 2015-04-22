import MCRoutes = require('services/master-control');

module LeaderboardMapper {
    export function mapScores (mcData : MCRoutes.Leaderboards.Scores.Return) {
        return {
            scores: mcData.scores.map((score) => {
                return {
                    user_id: score.userId,
                    username: score.username,
                    score: score.value,
                    date_achieved: new Date(score.dateAchieved.toString()),
                    position: score.position
                };
            })
        };
    }

    export function mapSingleScore (score : MCRoutes.Leaderboards.Score.Return) {
        return {
            score: score.score,
            date_achieved: new Date(score.dateAchieved.toString()),
        };
    }
}

export = LeaderboardMapper;