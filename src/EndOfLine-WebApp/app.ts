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
var hapiAuthCookie = require('hapi-auth-cookie');
var hapiNamedRoutes = require('hapi-named-routes');
var hapiContextCredentials = require('hapi-context-credentials');

import GeneralController = require('./controllers/GeneralController');
import AccountController = require('./controllers/AccountController');
import GamesController = require('./controllers/GamesController');
import ActivityController = require('./controllers/ActivityController');
import DeveloperConsoleController = require('./controllers/DeveloperConsoleController');

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
    hapiAuthCookie,
    hapiNamedRoutes,
    hapiContextCredentials,
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

server.auth.strategy('session', 'cookie', {
    password: config.get('Auth.salt'),
    cookie: 'anon',
    redirectTo: '/login',
    domain: config.get('Server.domain'),
    isSecure: !config.get('Auth.allowInsecureCookies'),
});

server.views({
    engines: { html: nunjucks },
    path: 'views'
});

// Controllers
GeneralController(server);
AccountController(server, MasterControlService);
GamesController(server, MasterControlService);
ActivityController(server, MasterControlService);
DeveloperConsoleController(server, MasterControlService);

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