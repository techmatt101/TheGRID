import net = require('net');
import JsonSocket = require('json-socket');
import SocketRouter = require('socket-router');

JsonSocket.prototype.send = JsonSocket.prototype.sendMessage; //TODO: Hack :/

class Service {
    protected _socket : SocketRouter.Client;
    protected _timeout = 100;
    protected _attempts = 0;
    protected _lastConnected = '';

    constructor(host, port) {
        var name = (<any>this).constructor.name;
        var socketServer = new JsonSocket(new net.Socket());

        socketServer.connect(port, host);

        socketServer.on('connect', () => {
            console.info(name + ' SUCCESSFULLY CONNECTED to ' + host + ' on port ' + port);
            this._attempts = 0;
            this._lastConnected = new Date().toString();
        });

        socketServer.on('error', (err) => {
            if(this._attempts === 0) {
                console.error(name, 'CONNECTION FAILED to ' + host + ' on port ' + port, err);
            } else {
                console.error(name, 'RE-CONNECTION FAILED',  'ATTEMPTS: ' + this._attempts, 'LAST CONNECTED: ' + this._lastConnected);
            }
            this._attempts++;

            setTimeout(() => {
                socketServer.connect(port, host);
            }, this._timeout * this._attempts);
        });

        this._socket = new SocketRouter.Client(socketServer);
    }
}

export = Service;