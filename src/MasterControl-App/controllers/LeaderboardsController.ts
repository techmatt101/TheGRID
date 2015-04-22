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
import ActivitiesController = require('./ActivitiesController');

import Leaderboard = require('../models/Leaderboards/Leaderboard');
import NewLeaderboard = require('../models/Leaderboards/NewLeaderboard');
import Score = require('../models/Leaderboards/Score');

module LeaderboardsController {

    export module Info {

        export var PATH = 'leaderboard/info';

        export interface Data {
            id : string
        }

        export interface Return extends Leaderboard {
        }

        export function handler (data : Data) : Promise<Return> {
            return LeaderboardsDb.getLeaderboard(data.id)
                .then((game) => LeaderboardsMapper.mapDbLeaderboardToLeaderboard(game));
        }
    }

    export module Create {

        export var PATH = 'leaderboard/create';

        export interface Data extends NewLeaderboard {
        }

        export function handler (data : Data) : Promise<string> {
            return LeaderboardsDb.createLeaderboard(LeaderboardsMapper.mapNewLeaderboardToDbLeaderboard(data))
                .then((leaderboard) => {
                    GamesDb.addLeaderboard(leaderboard.game, leaderboard._id);
                    return leaderboard._id;
                });
        }
    }

    export module Delete {

        export var PATH = 'leaderboard/delete';

        export interface Data {
            id : string
        }

        export function handler (data : Data) : Promise<void> {
            return LeaderboardsDb.deleteLeaderboard(data.id)
                .then((leaderboard) => {
                    GamesDb.removeLeaderboard(data.id, leaderboard._id)
                });
        }
    }

    export module Scores {

        export var PATH = 'leaderboard/scores';

        export interface Data {
            id : string
            start? : number
            maxResults? : number
            userId? : string
            friendsOnly? : boolean
            showPlayer? : boolean
        }

        export interface Return {
            scores : Score[]
        }

        export function handler (data : Data) : Promise<Return> {
            return Promise.all<any>([
                LeaderboardsDb.getLeaderboardWithScores(data.id),
                (data.userId && data.friendsOnly) ? UsersDb.getUserById(data.userId) : null
            ])
                .then((results) => {
                    var leaderboard = LeaderboardsMapper.mapDbLeaderboardToLeaderboard(results[0]);
                    if (results[1]) {
                        var user = UsersMapper.mapDbUserToUser(results[1]);
                        leaderboard.scores = leaderboard.scores.filter((x) => (user.friendIds.indexOf(x.userId) !== -1 || x.userId === user.id));
                    }
                    return leaderboard;
                })
                .then((leaderboard) => {
                    if (data.maxResults) {
                        var begin, end;
                        if (data.showPlayer) {
                            var userIndex = leaderboard.scores.findIndex((x) => x.userId === data.userId);
                            begin = userIndex - Math.floor(data.maxResults / 2);
                        } else {
                            begin = data.start || 0;
                        }
                        end = begin + data.maxResults;
                        leaderboard.scores = leaderboard.scores.slice(begin, end);
                    }
                    return leaderboard;
                })
                .then((leaderboards) => {
                    leaderboards.scores.sort((a, b) => {
                        if (a.value < b.value) return 1;
                        if (a.value > b.value) return -1;
                        return 0;
                    });
                    return { scores: leaderboards.scores };
                });
        }
    }

    export module Score {

        export var PATH = 'leaderboard/score';

        export interface Data {
            id : string
            userId : string
        }

        export interface Return {
            score : number
            dateAchieved : Date
        }

        export function handler (data : Data) : Promise<Return> {
            return PlayerDataDb.getPlayerData(data.userId)
                .then((playerData) => PlayerDataMapper.mapDbPlayerDataToPlayerData(playerData))
                .then((playerData) => {
                    var score = playerData.scores.find((x) => x.leaderboardId === data.id);
                    if (typeof score === 'undefined') return Promise.reject(new Error('No score found for user in leaderboard'));
                    return {
                        score: score.value,
                        dateAchieved: score.dateAchieved
                    };
                });
        }
    }

    export module SubmitScore {

        export var PATH = 'leaderboard/submit-score';

        export interface Data {
            id : string
            userId : string
            score : number
        }

        export function handler (data : Data) : Promise<void> {
            return PlayerDataDb.getPlayerData(data.userId)
                .then((playerData) => PlayerDataMapper.mapDbPlayerDataToPlayerData(playerData))
                .then((playerData) => {
                    var index = playerData.scores.findIndex((x) => x.leaderboardId === data.id);
                    var score = playerData.scores[index];
                    if (typeof score === 'undefined') {
                        return UsersDb.getUserById(data.userId)
                            .then((user) => UsersMapper.mapDbUserToUser(user))
                            .then((user) => Promise.all<any>([
                                LeaderboardsDb.addScore(data.id, LeaderboardsMapper.mapNewScoreToDbScore({
                                    userId: data.userId,
                                    value: data.score
                                }, user)),
                                LeaderboardsDb.getLeaderboard(data.id)
                                    .then((leaderboard) => LeaderboardsMapper.mapDbLeaderboardToLeaderboard(leaderboard))
                                    .then((leaderboard) => Promise.all<any>([
                                        PlayerDataDb.addScore(user.id, PlayerDataMapper.mapNewPlayerScoreToDbPlayerScore(leaderboard.gameId, data.id, data.score)),
                                        GamesDb.getGame(leaderboard.gameId)
                                            .then((game) => GamesMapper.mapDbGameToGame(game))
                                            .then((game) => ActivitiesController.New.handler(Messages.Activities.firstScore(user, game, data.score)))
                                    ]))
                            ]));
                    }
                    if (data.score > score.value) {
                        return Promise.all<any>([
                            PlayerDataDb.updateScores(data.userId, data.id, data.score),
                            LeaderboardsDb.updateScores(data.id, data.userId, data.score),
                            Promise.all<any>([
                                UsersDb.getUserById(data.userId).then((user) => UsersMapper.mapDbUserToUser(user)),
                                GamesDb.getGame(score.gameId).then((game) => GamesMapper.mapDbGameToGame(game))
                            ]).then((results) => ActivitiesController.New.handler(Messages.Activities.beatScore(results[0], results[1], data.score, score.value)))
                            //TODO: send out notifications out to friends!
                            // - get friends
                            // - get their scores
                            // - filter to leaderboard
                            // - compare scores with old score
                            // - compare with new
                            // - send notification
                        ]);
                    }
                })
                .then(() => {
                }); //hmmm... hack to return void
        }
    }
}

export = LeaderboardsController;