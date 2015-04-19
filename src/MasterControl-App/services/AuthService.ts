import bcrypt = require('bcrypt');

import NewUser = require('../models/NewUser');
import User = require('../models/User');

module AuthService {

    export function encryptAccount(user : NewUser) : Promise<NewUser> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if(err) return reject(err);
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if(err) return reject(err);
                    user.password = hash;
                    resolve(user);
                });
            });
        });
    }

    export function testPassword(user : User, password : string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(err) return reject(err);
                resolve(res);
            });
        });
    }
}

export = AuthService;