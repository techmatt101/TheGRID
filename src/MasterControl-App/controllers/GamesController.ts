import GamesDb = require('../services/GamesDbService');
import GamesMapper = require('../mappers/GamesMapper');
import GameList = require('../models/Games/GameList');

module GamesController {

    export module List {

        export var PATH = 'games/list';

        export interface Data {
        }

        export interface Return {
            games : any[]
        }

        export function handler (data : Data) : Promise<Return> {
            return GamesDb.getList()
                .then((games) => {
                    return {
                        games: GamesMapper.mapGameList(games, new GameList()).toArray()
                    };
                });
        }
    }
}

export = GamesController;