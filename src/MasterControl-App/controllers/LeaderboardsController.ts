import LeaderboardsDb = require('../services/LeaderboardsDbService');
import PlayerDataDb = require('../services/PlayerDataDbService');
import UsersDb = require('../services/UsersDbService');
import GamesDb = require('../services/GamesDbService');
import LeaderboardsMapper = require('../mappers/LeaderboardsMapper');
import UsersMapper = require('../mappers/UsersMapper');
import PlayerDataMapper = require('../mappers/PlayerDataMapper');

import Leaderboard = require('../models/Leaderboards/Leaderboard');
import NewLeaderboard = require('../models/Leaderboards/NewLeaderboard');
import Score = require('../models/Leaderboards/Score');
import ScoreList = require('../models/Leaderboards/Scores');

import ScoresService = require('../services/ScoresService');

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
            perPage? : number
            page? : number
            userId? : string
            friendsOnly? : boolean
            showPlayer? : boolean
        }

        export interface Return {
            scores : Score[]
            pageUp? : number
            pageDown? : number
        }

        export function handler (data : Data) : Promise<Return> {
            data.page = data.page || 0;
            return Promise.all<any>([
                LeaderboardsDb.getLeaderboardWithScores(data.id),
                (data.friendsOnly && data.userId) ? UsersDb.getUserById(data.userId) : null
            ])
                .then((results) => {
                    var scores = new ScoreList(LeaderboardsMapper.mapDbLeaderboardToLeaderboard(results[0]));
                    if (results[1]) scores.filterByFriends(UsersMapper.mapDbUserToUser(results[1]));

                    scores.updatePositions();

                    if (data.perPage) {
                        data.page = data.page || 0;
                        if (data.showPlayer && data.userId) scores.trimToPlayer(data.userId, data.perPage);
                        else scores.trim(data.page, data.perPage);
                    }

                    var out : any = {};
                    if(data.perPage){
                        if(data.page + 1 >= 0) out.pageUp = data.page + 1;
                        if(data.page - 1 < scores.toArray().length) out.pageDown = data.page - 1;
                    }
                    out.scores = scores.toArray();
                    return out;
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
            return ScoresService.submit(data.id, data.userId, data.score)
                .then(() => {}); //hmmm... hack to return void
        }
    }
}

export = LeaderboardsController;