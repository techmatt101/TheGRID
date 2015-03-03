import config = require('config');
import net = require('net');
import JsonSocket = require('json-socket');
import SocketRouter = require('socket-router');

JsonSocket.prototype.send = JsonSocket.prototype.sendMessage; //TODO: Hack :/

module MasterControlService {
    var socketServer = new JsonSocket(new net.Socket());
    socketServer.connect(config.get('MasterControlService.port'), config.get('MasterControlService.host'));
    var masterControlSocket = new SocketRouter.Client(socketServer);

    export function requestLeaderboardScores(data : MCRoutes.Leaderboard.Scores.Data, callback : (err?, data? : MCRoutes.Leaderboard.Scores.Return) => void) {
        masterControlSocket.send('leaderboard/scores', data, callback);
    }
}

export = MasterControlService;