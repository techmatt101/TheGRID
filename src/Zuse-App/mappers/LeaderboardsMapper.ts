import MCRoutes = require('services/master-control');

module LeaderboardMapper {
    export function  mapScoreList (mcData : MCRoutes.Leaderboards.Scores.Return) {
        return {
            scores: mcData.scores.map((score) => {
                return {
                    id: ~~(Math.random() * 1000),
                    username: "tron" + ~~(Math.random() * 100),
                    value: score.value,
                    date_achieved: score.dateAchieved,
                    position: 1
                }
            })
        };
    }
}

export = LeaderboardMapper;