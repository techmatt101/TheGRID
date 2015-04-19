import AuthTokenService = require('../services/AuthTokenService');

module UsersTokenController {

    export interface ITokenData {
        userId : string
        canceled : boolean
    }

    export module New {

        export var PATH = 'user-token/new';

        export interface Data { }
        export interface Return { token : string }

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            reply({ token: AuthTokenService.generateToken() });
        }
    }

    export module Get {

        export var PATH = 'user-token/get';

        export interface Data { token : string }
        export interface Return extends AuthTokenService.IToken<ITokenData> {}

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            var token = AuthTokenService.getToken<ITokenData>(data.token);
            if(token === null) return reply.error('Token not found');
            reply(token);
        }
    }

    export module Update {

        export var PATH = 'user-token/get-token';

        export interface Data {
            token : string
            data : ITokenData
        }
        export interface Return { }

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            var token = AuthTokenService.getToken<ITokenData>(data.token);
            if(token === null) return reply.error('Token not found');
            token.data = data.data;
            reply({ success: true });
        }
    }
}

export = UsersTokenController;