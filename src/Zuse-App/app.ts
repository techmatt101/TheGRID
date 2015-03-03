/// <reference path="typings/tsd.d.ts" />

import config = require('config');
import Hapi = require('hapi');
import Joi = require('joi');
import Boom = require('boom');

import LeaderboardRoutes = require('./routes/LeaderboardRoutes');

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

server.start(() => {
    console.log('Server running at: ' + server.info.uri);
});