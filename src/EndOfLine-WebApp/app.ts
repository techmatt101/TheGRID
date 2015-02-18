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

server.register([
        {register: require('hapi-named-routes')},
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
        server.start(() => {
            console.log('Server running at: ' + server.info.uri);
        });
    }
);

server.views({
    engines: {hbs: require("handlebars")},
    relativeTo: process.cwd(),
    path: 'views',
    partialsPath: 'views/partials'
});

// Content Resources
server.route({ //TODO: might be a better way to do this. //TODO: not including favicon.ico and robot.txt
    method: 'GET',
    path: '/content/{resource*}',
    handler: (request, reply) => {
        reply.file('content/' + request.params.resource);
    }
});

// Style Guide
server.route({
    method: "GET",
    path: "/style-guide",
    handler: (request, reply) => {
        reply.view("style-guide");
    },
    config: {id: 'style_guide'}
});

// Home
server.route({
    method: "GET",
    path: "/",
    handler: (request, reply) => {
        reply.view("public/home");
    },
    config: {'id': 'home'}
});

// Developers
server.route({
    method: "GET",
    path: "/dev",
    handler: (request, reply) => {
        reply.view("public/developers");
    },
    config: {'id': 'developers'}
});

// Login
server.route({
    method: "GET",
    path: "/login",
    handler: (request, reply) => {
        reply.view("public/login");
    },
    config: {'id': 'login'}
});

// Register
server.route({
    method: "GET",
    path: "/join",
    handler: (request, reply) => {
        reply.view("public/register");
    },
    config: {'id': 'register'}
});