import AuthTokenService = require('../services/AuthTokenService');

module UsersTokenController {

    export interface ITokenData {
        userId : string
        canceled : boolean
    }

    export module New {

        export var PATH = 'user-token/new';

        export interface Return { token : string }

        export function handler () : Promise<Return> {
            return Promise.resolve({ token: AuthTokenService.generateToken() });
        }
    }

    export module Get {

        export var PATH = 'user-token/get';

        export interface Data { token : string }
        export interface Return extends AuthTokenService.IToken<ITokenData> {}

        export function handler (data : Data) : Promise<Return> {
            var token = AuthTokenService.getToken<ITokenData>(data.token);
            if(token === null) return Promise.reject(new Error('Token not found'));
            return Promise.resolve(token);
        }
    }

    export module Update {

        export var PATH = 'user-token/get-token';

        export interface Data {
            token : string
            data : ITokenData
        }

        export function handler (data : Data) : Promise<void> {
            var token = AuthTokenService.getToken<ITokenData>(data.token);
            if(token === null) return Promise.reject('Token not found');
            token.data = data.data;
            return Promise.resolve<void>();
        }
    }
}

export = UsersTokenController;