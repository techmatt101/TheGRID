/// <reference path="typings/tsd.d.ts" />

import config = require('config');
import asciify = require('asciify');
import fs = require('fs');
import Hapi = require('hapi');
import Boom = require('boom');
import services = require('services');

var nunjucks = require('nunjucks-hapi');
var good = require('good');
var goodConsole = require('good-console');

import GeneralController = require('./controllers/GeneralController');
import AccountController = require('./controllers/AccountController');
import GamesController = require('./controllers/GamesController');

asciify('End Of Line', { font: 'smslant' }, (err, res) => console.log(res));

var server = new Hapi.Server();
var MasterControlService = new services.MasterControlService(
    config.get('MasterControlService.host'),
    config.get('MasterControlService.port')
);

server.connection({
    port: config.get('Server.port'),
    host: config.get('Server.host')
});

server.register([
    {
        register: good,
        options: {
            reporters: [{
                reporter: goodConsole,
                args: [{ log: '*', response: '*' }]
            }]
        }
    }
], (err) => {
    if (err) throw err;
    server.start(() => console.log('Server running at: ' + server.info.uri));
});

server.views({
    engines: { html: nunjucks },
    path: 'views'
});

// Controllers
GeneralController(server);
AccountController(server);
GamesController(server, MasterControlService);

// Content Resources
server.route({
    method: 'GET',
    path: '/{resource*}',
    handler: (request, reply) => {
        var path = 'content/' + request.params.resource;
        fs.exists(path, (exists) => {
            if (exists) {
                reply.file(path);
            } else {
                reply.view('404').code(404);
            }
        });
    }
});