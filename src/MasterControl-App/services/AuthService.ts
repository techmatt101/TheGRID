import bcrypt = require('bcrypt');

module AuthService {

    export function encryptPassword(password : string) : Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if(err) return reject(err);
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) return reject(err);
                    resolve(hash);
                });
            });
        });
    }

    export function testPassword(hashedPassword : string, password : string) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hashedPassword, (err, res) => {
                if(err) return reject(err);
                resolve(res);
            });
        });
    }
}

export = AuthService;