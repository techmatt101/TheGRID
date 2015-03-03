declare module "json-socket" {
    class JsonSocket {
        constructor(socket /*: net.Socket*/);
        sendSingleMessage(port : number, host : string, message : any, callback? : (err, msg) => void);
        sendSingleMessageAndReceive(port : number, host : string, message : any, callback? : (err, msg) => void);
        send(message : any, callback? : (err, msg) => void);
        sendMessage(message : any, callback? : (err, msg) => void);
        sendEndMessage(message : any, callback? : (err, msg) => void);
        sendError(err, callback? : (err, msg) => void);
        sendEndError(err, callback? : (err, msg) => void);
        isClosed() : boolean;

        on(event: string, listener: Function);
        connect(port : number, host : string);
        //end();
    }

    export = JsonSocket;
}