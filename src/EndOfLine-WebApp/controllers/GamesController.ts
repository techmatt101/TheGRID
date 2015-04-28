import Boom = require('boom');
import services = require('services');

import GamesMapper = require('../mappers/GamesMapper');

function GamesController (server : Hapi.Server, MasterControlService : services.MasterControlService) {
    server.route({
        method: 'GET',
        path: '/arcade',
        handler: (request, reply) => {
            MasterControlService.searchGames({ search: '' })
                .then((data) => reply.view('games/games', { games: data.games }))
                .catch((err) => reply(Boom.badImplementation()));  //TODO: hmmm....
        },
        config: {
            id: 'games',
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/games/{gameId}',
        handler: (request, reply) => {
            MasterControlService.getGameDetails({ id: request.params.gameId })
                .then((game) => reply.view('games/game', {
                    title: game.name,
                    game: game
                }))
                .catch((err) => reply(Boom.badImplementation()));  //TODO: hmmm....
        },
        config: {
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        }
    });
}

export = GamesController;