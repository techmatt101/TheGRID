import GamesDb = require('../services/GamesDbService');
import GameList = require('../models/GameList');
import Game = require('../models/Game');

module GamesMapper {
    export function mapGameList (dbData : GamesDb.IGame[], gameList : GameList) {
        for (var gameData of dbData) {
            gameList.games.push(this.mapGame(gameData));
        }
        return gameList;
    }

    export function mapGame (dbData : GamesDb.IGame) : Game {
        return {
            title: dbData.name
        };
    }
}

export = GamesMapper;