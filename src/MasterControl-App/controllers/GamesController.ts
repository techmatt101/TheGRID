import Games = require('../modules/Games');

module GamesController {

    export module List {

        export var PATH = 'games/list';

        export interface Data {
        }

        export interface Return {
            games : any[]
        }

        export function handler(reply : SocketRouter.Reply<Return>, data : Data) {
            Games.getList((err, games) => {
                if (err) reply.error(err);
                reply( {
                    games: games
                });
            });
        }
    }
}

export = GamesController;