import uid = require('uid');


module AuthTokenService {
    var tokenTable = {};

    export interface IToken<T> {
        created: number
        data: T
    }

    // Clean up
    setInterval(() => {
        var now = Date.now();
        for (var key in tokenTable) {
            if (tokenTable[key].created < now) {
                tokenTable[key] = undefined;
            }
        }
    }, 1000 * 60 * 60); // 1 hour


    export function generateToken (data = null, timespan = 1000 * 60 * 2, tokenSize = 16) {
        var token = uid(tokenSize);
        tokenTable[token] = {
            created: Date.now() + timespan,
            data: data
        };
        return token;
    }

    export function getToken<T> (tokenKey) : IToken<T> {
        var token = tokenTable[tokenKey];
        if(typeof token === 'undefined') return null;
        if(token.created < Date.now()) return null;
        return token;
    }
}

export = AuthTokenService;