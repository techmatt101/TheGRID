/// <reference path="dt/node.d.ts" />
/// <reference path="dt/config.d.ts" />
/// <reference path="dt/hapi.d.ts" />
/// <reference path="dt/joi.d.ts" />
/// <reference path="dt/boom.d.ts" />

import config = require('config');
import Hapi = require('hapi');
import Joi = require('joi');
import Boom = require('boom');

var server = new Hapi.Server();

server.connection({
    port: config.get('Server.port'),
    host: config.get('Server.host')
});

server.register({
    register: require('good'),
    options: {
        reporters: [{
            reporter: require('good-console'),
            args: [{log: '*', response: '*'}]
        }]
    }
}, (err) => {
    if (err) console.error('Failed to load a plugin:', err);
});

// 404
server.route({
    method: '*',
    path: '/{p*}',
    handler: (request, reply) => reply(Boom.notFound("Resource not found. Please visit documentation: http://docs.thegrid.apiary.io/"))
});

//Docs
server.route({
    method: '*',
    path: '/docs',
    handler: (request, reply) => reply.redirect('http://docs.thegrid.apiary.io/')
});


// List Scores
server.route({
    method: 'GET',
    path: '/leaderboards/{leaderboardId}/scores',
    handler: (request : Hapi.Request, reply) => {
        if (request.params.leaderboardId !== 123) {
            return reply(Boom.notAcceptable("LeaderboardId '" + request.params.leaderboardId + "' not found."));
        }

        var maxResults = request.query.maxResults;
        var playerId = request.query.playerId;

        var scores = [], score = 34231;
        for (var i = 1; i <= maxResults; i++) {
            scores.push({
                id: ~~(Math.random() * 1000),
                username: "tron" + ~~(Math.random() * 100),
                score: score -= ~~(Math.random() * 1000),
                position: i
            });
        }
        reply({scores: scores});
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
    handler: (request : Hapi.Request, reply) => {
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

server.start(() => {
    console.log('Server running at: ' + server.info.uri);
});