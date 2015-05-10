/// <reference path="typings/tsd.d.ts" />

import config = require('config');
import asciify = require('asciify');
import Hapi = require('hapi');
import Boom = require('boom');
import services = require('services');

import UserController = require('./controllers/UserController');
import LeaderboardController = require('./controllers/LeaderboardsController');

asciify('Zuse', { font: 'smslant' }, (err, res) => console.log(res));

var server = new Hapi.Server();
var MasterControlService = new services.MasterControlService(
    config.get('MasterControlService.host'),
    config.get('MasterControlService.port')
);

// Setup
server.connection({
    port: config.get('Server.port'),
    host: config.get('Server.host')
});

server.register({
    register: require('good'),
    options: {
        reporters: [{
            reporter: require('good-console'),
            args: [{ log: '*', response: '*' }]
        }]
    }
}, (err) => {
    if (err) console.error('Failed to load a plugin:', err);
});

server.start(() => {
    console.log('Server running at: ' + server.info.uri);
});

server.ext('onPreResponse', (request : any, reply : any) => {
    var response = request.response;
    if (response.isBoom) {
        response.output.payload.success = false;
    } else {
        response.source = {
            success: true,
            response: response.source
        };
    }
    return reply.continue();
});


// Routes
UserController(server, MasterControlService);
LeaderboardController(server, MasterControlService);

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
