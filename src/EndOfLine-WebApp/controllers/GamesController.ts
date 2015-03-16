import Joi = require('joi');
import Boom = require('boom');
import services = require('services');

import GamesMapper = require('../mappers/GamesMapper');

function GamesController (server : Hapi.Server, MasterControlService : services.MasterControlService) {
    server.route({
        method: 'GET',
        path: '/games',
        handler: (request, reply) => {
            MasterControlService.requestListOfGames({}, (err, data) => {
                if(err) reply(Boom.badImplementation()); //TODO: hmmm....
                reply.view('dashboard/games', GamesMapper.games(data));
            });
        },
        config: {id: 'games'}
    });

    server.route({
        method: 'GET',
        path: '/games/{name}',
        handler: (request, reply) => {
            MasterControlService.requestListOfGames({}, (err, data) => {
                if(err) reply(Boom.badImplementation()); //TODO: hmmm....
                reply.view('dashboard/games', GamesMapper.games(data));
            });
        },
        config: {id: 'games'}
    });
}

export = GamesController;