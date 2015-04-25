import uid = require('uid');


module AuthTokenService {
    var tokens = [];

    export interface IToken<T> {
        created: number
        data: T
    }

    // Clean up
    setInterval(() => {
        var now = Date.now();
        var activeTokens = [];
        for(var token of tokens) {
            if (token.created > now) {
                activeTokens.push(token);
            }
        }
        tokens = activeTokens;
    }, 1000 * 60 * 60); // 1 hour


    export function generateToken (data = null, timespan = 1000 * 60 * 5, tokenSize = 16) {
        var token = uid(tokenSize);
        tokens.push({
            key: token,
            created: Date.now() + timespan,
            data: data
        });
        return token;
    }

    export function getToken<T> (tokenKey) : IToken<T> {
        var token = tokens.find((x) => x.key === tokenKey);
        if(typeof token === 'undefined') return null;
        if(token.created < Date.now()) return null;
        return token;
    }
}

export = AuthTokenService;