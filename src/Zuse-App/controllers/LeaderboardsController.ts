import Hapi = require('hapi');
import Joi = require('joi');
import Boom = require('boom');
import services = require('services');
import LeaderboardMapper = require('../mappers/LeaderboardsMapper')

function LeaderboardsController (server : Hapi.Server, MasterControlService : services.MasterControlService) {
    // List Scores
    server.route({
        method: 'GET',
        path: '/leaderboards/{leaderboard_id}/scores',
        handler: (request, reply) => {
            MasterControlService.getListOfScores({
                id: request.params['leaderboard_id'],
                perPage: request.query.per_page,
                page: request.query.page,
                userId: request.query.player_id,
                friendsOnly: request.query.friends_only,
                showPlayer: request.query.show_player
            })
                .then((data) => reply(LeaderboardMapper.mapScores(data)))
                .catch((err) => reply(Boom.notAcceptable("Leaderboard Id '" + request.params['leaderboard_id'] + "' not found."))); //TODO: better message
        },
        config: {
            validate: {
                params: {
                    leaderboard_id: Joi.string().alphanum()
                },
                query: {
                    per_page: Joi.number().integer().min(1).max(100).default(10),
                    page: Joi.number().integer(),
                    player_id: Joi.string().alphanum(),
                    friends_only: Joi.boolean(),
                    show_player: Joi.boolean()
                }
            },
            jsonp: 'callback'
        }
    });

    // Get Score
    server.route({
        method: 'GET',
        path: '/leaderboards/{leaderboard_id}/players/{player_id}/score',
        handler: (request, reply) => {
            MasterControlService.getScore({
                id: request.params['leaderboard_id'],
                userId: request.params['player_id']
            })
                .then((data) => reply(LeaderboardMapper.mapSingleScore(data)))
                .catch((err) => reply(Boom.notAcceptable("Player '" + request.params['player_id'] + "' has no recorded score for leaderboard '" + request.params['leaderboard_id'] + "'."))); //TODO: better message
        },
        config: {
            validate: {
                params: {
                    leaderboard_id: Joi.string().alphanum(),
                    player_id: Joi.string().alphanum()
                }
            },
            jsonp: 'callback'
        }
    });

    // Submit Score
    server.route({
        method: ['GET', 'POST'],
        path: '/leaderboards/{leaderboard_id}/players/{player_id}/submit',
        handler: (request, reply) => {
            MasterControlService.submitScore({
                id: request.params['leaderboard_id'],
                userId: request.params['player_id'],
                score: request.payload.score
            })
                .then((data) => reply({ success: true}))
                .catch((err) => reply(Boom.notAcceptable("Player or Leaderboard not found."))); //TODO: better message
        },
        config: {
            validate: {
                params: {
                    leaderboard_id: Joi.string().alphanum(),
                    player_id: Joi.string().alphanum()
                }
            },
            jsonp: 'callback'
        }
    });
}

export = LeaderboardsController;