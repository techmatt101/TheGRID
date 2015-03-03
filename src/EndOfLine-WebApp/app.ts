/// <reference path="dt/node.d.ts" />
/// <reference path="dt/config.d.ts" />
/// <reference path="dt/hapi.d.ts" />
/// <reference path="dt/joi.d.ts" />
/// <reference path="dt/boom.d.ts" />

import config = require('config');
import fs = require('fs');
import Hapi = require('hapi');
import Joi = require('joi');
import Boom = require('boom');

var server = new Hapi.Server();

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
                args: [{log: '*', response: '*'}]
            }]
        }
    }
], (err) => {
    if (err) throw err;
    server.start(() => console.log('Server running at: ' + server.info.uri));
});

server.views({
    engines: {hbs: require('handlebars')},
    relativeTo: process.cwd(),
    path: 'views',
    partialsPath: 'views/partials'
});

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

// Style Guide
server.route({
    method: 'GET',
    path: '/style-guide',
    handler: (request, reply) => {
        reply.view('style-guide');
    },
    config: {id: 'styleGuide'}
});

// Home
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply.view('public/home');
    },
    config: {id: 'home'}
});

// Developers
server.route({
    method: 'GET',
    path: '/dev',
    handler: (request, reply) => {
        reply.view('public/developers');
    },
    config: {id: 'developers'}
});

// Login
server.route({
    method: 'GET',
    path: '/login',
    handler: (request, reply) => {
        reply.view('public/login');
    },
    config: {id: 'login'}
});

server.route({
    method: 'POST',
    path: '/login',
    handler: (request, reply) => {
        reply.redirect('/');
    }
});

// Register
server.route({
    method: 'GET',
    path: '/join',
    handler: (request, reply) => {
        reply.view('public/register');
    },
    config: {id: 'register'}
});

// Activity
server.route({
    method: 'GET',
    path: '/activity',
    handler: (request, reply) => {
        reply.view('dashboard/activity');
    },
    config: {id: 'activity'}
});

// Games
server.route({
    method: 'GET',
    path: '/games',
    handler: (request, reply) => {
        reply.view('dashboard/games');
    },
    config: {id: 'games'}
});

// Settings
server.route({
    method: 'GET',
    path: '/settings',
    handler: (request, reply) => {
        reply.view('dashboard/settings');
    },
    config: {id: 'settings'}
});