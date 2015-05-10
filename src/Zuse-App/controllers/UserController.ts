import Hapi = require('hapi');
import Joi = require('joi');
import Boom = require('boom');
import services = require('services');

import UsersMapper = require('../mappers/UsersMapper');

function UserController (server : Hapi.Server, MasterControlService : services.MasterControlService) {
    // List Scores
    server.route({
        method: 'GET',
        path: '/users/tokens/generate',
        handler: (request, reply) => {
            MasterControlService.generateNewUserToken()
                .then((data) => reply(UsersMapper.mapUserToken(data)))
                .catch((err) => reply(Boom.badImplementation()));
        },
        config: {
            jsonp: 'callback'
        }
    });

    server.route({
        method: 'GET',
        path: '/users/tokens/{token_id}',
        handler: (request, reply) => {
            MasterControlService.getUserToken({token : request.params['token_id'] } )
                .then((data) => reply(data))
                .catch((err) => reply(Boom.notAcceptable('Token has expired')));
        },
        config: {
            jsonp: 'callback'
        }
    });

    // Get Score
    server.route({
        method: 'GET',
        path: '/users/{user_id}/info',
        handler: (request, reply) => {
            MasterControlService.getUserDetails({
                id: request.params['user_id'],
            })
                .then((data) => reply(data))
                .catch((err) => reply(Boom.notAcceptable("BOOM"))); //TODO: better message
        },
        config: {
            jsonp: 'callback'
        }
    });
}

export = UserController;