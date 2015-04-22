/// <reference path="../helpers/polyfills" />
var polyfills = require('../helpers/polyfills');

import LeaderboardsDb = require('../services/LeaderboardsDbService');
import UsersDb = require('../services/UsersDbService');
import GamesDb = require('../services/GamesDbService');
import LeaderboardsMapper = require('../mappers/LeaderboardsMapper');
import UsersMapper = require('../mappers/UsersMapper');

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
            return LeaderboardsDb.getLeaderboardWithScores(data.id)
                .then((leaderboard) => LeaderboardsMapper.mapDbLeaderboardToLeaderboard(leaderboard))
                .then((leaderboard) => {
                    if (data.userId && data.friendsOnly) {
                        return UsersDb.getUserById(data.userId)
                            .then((user) => UsersMapper.mapDbUserToUser(user))
                            .then((user) => {
                                leaderboard.scores = leaderboard.scores.filter((x) => (user.friendIds.indexOf(x.userId) !== -1 || x.userId === user.id));
                                return leaderboard;
                            });
                    }
                    return leaderboard;
                })
                .then((leaderboard : Leaderboard) => {
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

    export module SubmitScore {

        export var PATH = 'leaderboard/submit-score';

        export interface Data {
            id : string
            userId : string
            score : number
        }

        export function handler (data : Data) : Promise<void> {
            return LeaderboardsDb.getLeaderboardWithScores(data.id)
                .then((leaderboard) => LeaderboardsMapper.mapDbLeaderboardToLeaderboard(leaderboard))
                .then((leaderboard) => {
                    var index = leaderboard.scores.findIndex((x) => x.userId === data.userId);
                    if (index === -1) {
                        return UsersDb.getUserById(data.id)
                            .then((user) => UsersMapper.mapDbUserToUser(user))
                            .then((user) => LeaderboardsMapper.mapNewScoreToDbScore({
                                userId: data.userId,
                                value: data.score
                            }, user))
                            .then((score) => LeaderboardsDb.addScore(data.id, score));
                    }
                    var score = leaderboard.scores[index];
                    if(data.score > score.value) {
                        score.value = data.score;
                        return LeaderboardsDb.updateScores(data.id, LeaderboardsMapper.mapScoreToDbScore(score));
                    }
                })
                .then(() => {}); //hmmm... hack to return void
        }
    }
}

export = LeaderboardsController;