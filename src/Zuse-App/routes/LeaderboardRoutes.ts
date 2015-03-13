import Joi = require('joi');
import Boom = require('boom');
import services = require('services');

function LeaderboardRoutes (server : Hapi.Server, MasterControlService : services.MasterControlService) {
    // List Scores
    server.route({
        method: 'GET',
        path: '/leaderboards/{leaderboardId}/scores',
        handler: (request : Hapi.Request, reply : Hapi.Reply) => {
            if (request.params.leaderboardId !== 123) {
                return reply(Boom.notAcceptable("LeaderboardId '" + request.params.leaderboardId + "' not found."));
            }

            MasterControlService.requestLeaderboardScores({ id: 1 }, (err, data) => {
                if (err) return reply(Boom.badImplementation());
                reply({ scores: data.scores });
            });
        },
        config: {
            validate: {
                params: {
                    leaderboardId: Joi.number().integer()
                },
                query: {
                    maxResults: Joi.number().integer().min(1).max(100).default(10),
                    playerId: Joi.number().integer()
                }
            },
            jsonp: 'callback'
        }
    });

    // Get Score
    server.route({
        method: 'GET',
        path: '/leaderboards/{leaderboardId}/players/{playerId}/score',
        handler: (request : Hapi.Request, reply : Hapi.Reply) => {
            reply({
                position: 74,
                score: 34231
            });
        },
        config: {
            validate: {
                params: {
                    leaderboardId: Joi.number().integer(),
                    playerId: Joi.number().integer()
                }
            },
            jsonp: 'callback'
        }
    });

    // Submit Score
    server.route({
        method: 'POST',
        path: '/leaderboards/{leaderboardId}/players/{playerId}/submit',
        handler: (request : Hapi.Request, reply : Hapi.Reply) => {
            reply.success();
        },
        config: {
            validate: {
                params: {
                    leaderboardId: Joi.number().integer(),
                    playerId: Joi.number().integer()
                }
            },
            jsonp: 'callback'
        }
    });
}

export = LeaderboardRoutes;