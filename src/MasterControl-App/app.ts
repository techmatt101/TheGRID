/// <reference path="typings/tsd.d.ts" />

import config = require('config');
import net = require('net');
import JsonSocket = require('json-socket');
import SocketRouter = require('socket-router');
import mongoose = require('mongoose');
// Models
import Leaderboards = require('./modules/Leaderboards');

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


export module IRoutes {

    export module Leaderboard {

        export module Scores {

            export interface Data {
                id : number
            }

            export interface Return {
                scores : any[]
            }

            server.route('leaderboard/scores', (reply, data : Data) => {
                Leaderboards.getScoreList(data.id, (err, leaderboard) => {
                    if (err) reply.error(err);
                    reply(<Return> {
                        scores: leaderboard.scores
                    });
                });
            });
        }

    }
}