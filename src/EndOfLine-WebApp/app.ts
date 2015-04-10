/// <reference path="typings/tsd.d.ts" />

import config = require('config');
import asciify = require('asciify');
import fs = require('fs');
import Hapi = require('hapi');
import Boom = require('boom');
import services = require('services');

import GeneralController = require('./controllers/GeneralController');
import AccountController = require('./controllers/AccountController');
import DashboardController = require('./controllers/DashboardController');
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
    require('hapi-named-routes'),
    {
        register: require('good'),
        options: {
            reporters: [{
                reporter: require('good-console'),
                args: [{ log: '*', response: '*' }]
            }]
        }
    }
], (err) => {
    if (err) throw err;
    server.start(() => console.log('Server running at: ' + server.info.uri));
});

server.views({
    engines: { hbs: require('handlebars') },
    relativeTo: process.cwd(),
    path: 'views',
    partialsPath: 'views/partials'
});

// Controllers
GeneralController(server);
AccountController(server);
DashboardController(server);
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