/// <reference path="../helpers/polyfills" />
var polyfills = require('../helpers/polyfills');

import ActivitiesController = require('../controllers/ActivitiesController');
import LeaderboardsDb = require('../services/LeaderboardsDbService');
import PlayerDataDb = require('../services/PlayerDataDbService');
import UsersDb = require('../services/UsersDbService');
import GamesDb = require('../services/GamesDbService');
import Messages = require('../services/MessagesService');

import LeaderboardsMapper = require('../mappers/LeaderboardsMapper');
import UsersMapper = require('../mappers/UsersMapper');
import GamesMapper = require('../mappers/GamesMapper');
import PlayerDataMapper = require('../mappers/PlayerDataMapper');

import User = require('../models/Users/User');
import PlayerData = require('../models/PlayerData/PlayerData');
import Game = require('../models/Games/Game');
import Leaderboard = require('../models/Leaderboards/Leaderboard');
import Score = require('../models/Leaderboards/Score');

module ScoresService {

    export function submit (leaderboardId : string, userId : string, newScore : number) {
        return PlayerDataDb.getPlayerData(userId)
            .then((playerData) => PlayerDataMapper.mapDbPlayerDataToPlayerData(playerData))
            .then((playerData) => {
                var index = playerData.scores.findIndex((x) => x.leaderboardId === leaderboardId);
                var currentScore = playerData.scores[index];
                if (typeof currentScore !== 'undefined' && newScore <= currentScore.value) return;
                Promise.all<any>([
                    LeaderboardsDb.getLeaderboard(leaderboardId).then((leaderboard) => LeaderboardsMapper.mapDbLeaderboardToLeaderboard(leaderboard)),
                    UsersDb.getUserById(userId).then((user) => UsersMapper.mapDbUserToUser(user))
                ])
                    .then((results) => results.push(GamesDb.getGame(results[0].gameId)
                        .then((game) => GamesMapper.mapDbGameToGame(game))))
                    .then((results) => {
                        var leaderboard : Leaderboard = results[0], user : User = results[1], game : Game = results[2];
                        if (typeof currentScore === 'undefined') {
                            return addScore(leaderboard, game, user, newScore);
                        } else if (newScore > currentScore.value) {
                            return updateScore(leaderboard.id, user, game, newScore, currentScore.value);
                        }
                        earnBadge(leaderboard, playerData, newScore);
                        sendNotifications(user, newScore);
                    });
            });
    }

    function addScore (leaderboard : Leaderboard, game : Game, user : User, score : number) {
        return Promise.all<any>([
            LeaderboardsDb.addScore(leaderboard.id, LeaderboardsMapper.mapNewScoreToDbScore({
                userId: user.id,
                value: score
            }, user)),
            PlayerDataDb.addScore(user.id, PlayerDataMapper.mapNewPlayerScoreToDbPlayerScore(leaderboard.gameId, leaderboard.id, score)),
            ActivitiesController.New.handler(Messages.Activities.firstScore(user, game, score))
        ]);
    }

    function updateScore (leaderboardId : string, user : User, game : Game, newScore : number, oldScore : number) {
        return Promise.all<any>([
            PlayerDataDb.updateScores(user.id, leaderboardId, newScore),
            LeaderboardsDb.updateScores(leaderboardId, user.id, newScore),
            ActivitiesController.New.handler(Messages.Activities.beatScore(user, game, newScore, oldScore))
        ]);
    }

    function earnBadge (leaderboard : Leaderboard, player : PlayerData, newScore : number) {
        //if(newScore >= leaderboard.targetScore) {
            // and does not have badge
            // add badge
        //}
        return null;
    }

    function sendNotifications (user : User, newScore : number) {
        //TODO: send out notifications out to friends!
        // - get friends
        // - get their scores
        // - filter to leaderboard
        // - compare scores with old score
        // - compare with new
        // - send notification
        return null;
    }
}

export = ScoresService