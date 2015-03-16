import net = require('net');
import JsonSocket = require('json-socket');
import SocketRouter = require('socket-router');

JsonSocket.prototype.send = JsonSocket.prototype.sendMessage; //TODO: Hack :/

class Service {
    protected _socket : SocketRouter.Client;

    constructor(host, port) {
        var socketServer = new JsonSocket(new net.Socket());
        socketServer.connect(host, port);
        this._socket = new SocketRouter.Client(socketServer);
    }
}

export = Service;