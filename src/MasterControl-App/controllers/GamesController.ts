import GamesDb = require('../services/GamesDbService');
import GamesMapper = require('../mappers/GamesMapper');
import GameList = require('../models/GameList');

module GamesController {

    export module List {

        export var PATH = 'games/list';

        export interface Data {
        }

        export interface Return {
            games : any[]
        }

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            GamesDb.getList()
                .then((games) => {
                    reply({
                        games: GamesMapper.mapGameList(games, new GameList()).toArray()
                    });
                })
                .error((err) => reply.error(err));
        }
    }
}

export = GamesController;