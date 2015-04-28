/// <reference path="../helpers/polyfills" />
var polyfills = require('../helpers/polyfills');

import LeaderboardsDb = require('../services/LeaderboardsDbService');
import PlayerDataDb = require('../services/PlayerDataDbService');
import UsersDb = require('../services/UsersDbService');
import GamesDb = require('../services/GamesDbService');
import Messages = require('../services/MessagesService');
import LeaderboardsMapper = require('../mappers/LeaderboardsMapper');
import UsersMapper = require('../mappers/UsersMapper');
import GamesMapper = require('../mappers/GamesMapper');
import PlayerDataMapper = require('../mappers/PlayerDataMapper');
import ActivitiesController = require('../controllers/ActivitiesController');

import Score = require('../models/Leaderboards/Score');

module ScoresService {

    export function submit(leaderboardId : string, userId : string, newScore : number) {
        return PlayerDataDb.getPlayerData(userId)
            .then((playerData) => PlayerDataMapper.mapDbPlayerDataToPlayerData(playerData))
            .then((playerData) => {
                var index = playerData.scores.findIndex((x) => x.leaderboardId === leaderboardId);
                var score = playerData.scores[index];
                if (typeof score === 'undefined')  return addScore(leaderboardId, userId, newScore);
                else if (newScore > score.value) return updateScore(leaderboardId, userId, score.gameId, newScore, score.value);
            });
            //TODO: send out notifications out to friends!
            // - get friends
            // - get their scores
            // - filter to leaderboard
            // - compare scores with old score
            // - compare with new
            // - send notification
    }

    function addScore(id : string, userId : string, score : number) {
        return UsersDb.getUserById(userId)
            .then((user) => UsersMapper.mapDbUserToUser(user))
            .then((user) => Promise.all<any>([
                LeaderboardsDb.addScore(id, LeaderboardsMapper.mapNewScoreToDbScore({
                    userId: userId,
                    value: score
                }, user)),
                LeaderboardsDb.getLeaderboard(id)
                    .then((leaderboard) => LeaderboardsMapper.mapDbLeaderboardToLeaderboard(leaderboard))
                    .then((leaderboard) => Promise.all<any>([
                        PlayerDataDb.addScore(user.id, PlayerDataMapper.mapNewPlayerScoreToDbPlayerScore(leaderboard.gameId, id, score)),
                        GamesDb.getGame(leaderboard.gameId)
                            .then((game) => GamesMapper.mapDbGameToGame(game))
                            .then((game) => ActivitiesController.New.handler(Messages.Activities.firstScore(user, game, score)))
                    ]))
            ]));
    }

    function updateScore(id : string, userId : string, gameId, newScore : number, oldScore : number) {
        return Promise.all<any>([
            PlayerDataDb.updateScores(userId, id, newScore),
            LeaderboardsDb.updateScores(id, userId, newScore),
            Promise.all<any>([
                UsersDb.getUserById(userId).then((user) => UsersMapper.mapDbUserToUser(user)),
                GamesDb.getGame(gameId).then((game) => GamesMapper.mapDbGameToGame(game))
            ]).then((results) => ActivitiesController.New.handler(Messages.Activities.beatScore(results[0], results[1], newScore, oldScore)))
        ]);
    }
}

export = ScoresService