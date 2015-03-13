/// <reference path="typings/tsd.d.ts" />

import config = require('config');
import net = require('net');
import JsonSocket = require('json-socket');
import SocketRouter = require('socket-router');
import mongoose = require('mongoose');

mongoose.connect(config.get("mongodbServerUrl"), (err) => {
    if (err) throw err;
    console.info("Connected to mongodb");
});

var server = new SocketRouter.Server();
var socketServer = net.createServer((socket) => {
    socket.on('error', (err) => console.warn(err.stack));
    socket.on('close', () => console.info("Connection Ended"));
});
socketServer.listen(config.get('InternalCommunication.port'));
socketServer.on('connection', (socket) => {
    server.listen(new JsonSocket(socket));
    console.info("New Connection");
});
JsonSocket.prototype.send = JsonSocket.prototype.sendMessage; //TODO: Hack :/

function loadController(controller) {
    for(var key in controller) {
        var action = controller[key];
        if(typeof action.PATH === undefined || typeof action.handler === undefined) {
            throw new Error("Invalid Controller!")
        }
        server.route(action.PATH, action.handler);
    }
}

// Controllers

export import Leaderboards = require('./controllers/LeaderboardsController');
loadController(Leaderboards);

export import Games = require('./controllers/GamesController');
loadController(Games);

