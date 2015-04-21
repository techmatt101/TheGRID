import GamesDb = require('../services/GamesDbService');
import UpdateGame = require('../models/Games/UpdateGame');
import NewGame = require('../models/Games/NewGame');
import Game = require('../models/Games/Game');
import LeaderboardsMapper = require('./LeaderboardsMapper');
import UsersMapper = require('./UsersMapper');

module GamesMapper {

    export function mapDbGameToGame (dbData : GamesDb.IGameDoc) : Game {
        return {
            id: dbData._id,
            name: dbData.name,
            description: dbData.description,
            poster: dbData.poster,
            url: dbData.url,
            published: dbData.published,
            developer: UsersMapper.mapDbUserToUser(dbData.developer),
            categories: dbData.categories,
            leaderboards: dbData.leaderboards.map((leaderboard) => LeaderboardsMapper.mapDbLeaderboardToLeaderboard(leaderboard))
        };
    }

    export function mapNewGameToDbGame (newGame : NewGame) : GamesDb.IGame {
        return {
            name: newGame.name,
            published: newGame.published,
            poster: null,
            description: newGame.description,
            url: newGame.url,
            categories: newGame.categories,
            leaderboards: [],
            developer: newGame.developerId
        };
    }

    export function mapUpdateGameToDbGame (game : UpdateGame) : GamesDb.IGame {
        var obj : GamesDb.IGame = {};

        if (typeof game.name !== 'undefined')           obj.name = game.name;
        if (typeof game.published !== 'undefined')      obj.published = game.published;
        if (typeof game.description !== 'undefined')    obj.description = game.description;
        if (typeof game.categories !== 'undefined')     obj.categories = game.categories;
        if (typeof game.url !== 'undefined')            obj.url = game.url;

        return obj;
    }
}

export = GamesMapper;