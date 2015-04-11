import Boom = require('boom');
import services = require('services');

import GamesMapper = require('../mappers/GamesMapper');

function GamesController (server : Hapi.Server, MasterControlService : services.MasterControlService) {
    server.route({
        method: 'GET',
        path: '/games',
        handler: (request, reply) => {
            MasterControlService.requestListOfGames({})
                .then((data) => reply.view('dashboard/games', GamesMapper.games(data)))
                .catch((err) => reply(Boom.badImplementation()));  //TODO: hmmm....
        },
        config: { id: 'games' }
    });

    server.route({
        method: 'GET',
        path: '/games/{name}',
        handler: (request, reply) => {
            MasterControlService.requestListOfGames({})
                .then((data) => reply.view('dashboard/games', GamesMapper.games(data)))
                .catch((err) => reply(Boom.badImplementation()));  //TODO: hmmm....
        }
    });
}

export = GamesController;