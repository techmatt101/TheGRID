import validator = require('validator');

import UsersDb = require('../services/UsersDbService');
import AuthService = require('../services/AuthService');
import UsersMapper = require('../mappers/UsersMapper');
import NewUser = require('../models/Users/NewUser');
import UpdateUser = require('../models/Users/UpdateUser');
import User = require('../models/Users/User');

module UsersController {

    export module Availability {

        export var PATH = 'user/availability';

        export interface Data {
            username? : string
            email? : string
        }

        export interface Return {
            available : boolean
            username? : boolean
            email? : boolean
        }

        export function handler (data : Data) : Promise<Return> {
            return Promise.all([
                (data.username) ? UsersDb.getUserByUsername(data.username) : null,
                (data.email) ? UsersDb.getUserByEmail(data.email) : null
            ])
                .then((results) => {
                    var available = true;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i] !== null) {
                            available = false;
                            break;
                        }
                    }
                    return {
                        available: available,
                        username: results[0] === null,
                        email: results[1] === null
                    };
                });
        }
    }

    export module Login {

        export var PATH = 'user/login';

        export interface Data {
            username : string
            password : string
        }

        export interface Return extends User {
        }

        export function handler (data : Data) : Promise<Return> {
            return (validator.isEmail(data.username) ? UsersDb.getUserByEmail(data.username, true) : UsersDb.getUserByUsername(data.username, true))
                .then((userData) => UsersMapper.mapDbUserToUser(userData))
                .then((user) => AuthService.testPassword(user.password, data.password)
                    .then((result) => (result) ? Promise.resolve(user) : Promise.reject('Incorrect password')))
                .then((user) => UsersMapper.stripSensitiveData(user));
        }
    }

    export module Info {

        export var PATH = 'user/info';

        export interface Data {
            id : string
        }

        export interface Return extends User {
        }

        export function handler (data : Data) : Promise<Return> {
            return UsersDb.getUserById(data.id)
                .then((user) => UsersMapper.mapDbUserToUser(user));
        }
    }

    export module List {

        export var PATH = 'user/list';

        export interface Data {
            ids : string[]
        }

        export interface Return {
            users: User[]
        }

        export function handler (data : Data) : Promise<Return> {
            return UsersDb.getUsers(data.ids)
                .then((users) => users.map((user) => UsersMapper.mapDbUserToUser(user)))
                .then((users) => {
                    return { users: users };
                });
        }
    }

    export module Search {

        export var PATH = 'user/search';

        export interface Data {
            search : string
            maxResults? : number
        }

        export interface Return {
            users: User[]
        }

        export function handler (data : Data) : Promise<Return> {
            return UsersDb.searchUsers(data.search, data.maxResults)
                .then((users) => users.map((user) => UsersMapper.mapDbUserToUser(user)))
                .then((users) => {
                    return { users: users };
                });
        }
    }

    export module Create {

        export var PATH = 'user/create';

        export interface Data extends NewUser {
        }

        export function handler (data : Data) : Promise<string> {
            return AuthService.encryptAccount(data.password)
                .then((hashedPassword) => {
                    data.password = hashedPassword;
                    return data;
                })
                .then((data) => UsersMapper.mapNewUserToDbUser(data))
                .then((data) => UsersDb.createUser(data))
                .then((data) => data._id);
        }
    }

    export module Update {

        export var PATH = 'user/update';

        export interface Data {
            id : string
            updatedData : UpdateUser
        }

        export function handler (data : Data) : Promise<void> {
            return Promise.resolve(data.updatedData)
                .then((updatedData) => {
                    if (updatedData.password) {
                        return AuthService.encryptAccount(updatedData.password)
                            .then((hashedPassword) => {
                                updatedData.password = hashedPassword;
                                return updatedData;
                            });
                    }
                    return updatedData;
                })
                .then((updatedData) => UsersMapper.mapUpdateUserToDbUser(updatedData))
                .then((updatedData) => {
                    UsersDb.updateUser(data.id, updatedData);
                });
        }
    }

    export module AddFriend {

        export var PATH = 'user/add-friend';

        export interface Data {
            userId : string
            friendId : string
        }

        export function handler (data : Data) : Promise<void> {
            if (data.userId === data.friendId) return Promise.reject(new Error("User can't friend them selves"));
            return UsersDb.addFriend(data.userId, data.friendId)
                .then(() => {
                    UsersDb.addFriend(data.friendId, data.userId);
                });
        }
    }

    export module RemoveFriend {

        export var PATH = 'user/remove-friend';

        export interface Data {
            userId : string
            friendId : string
        }

        export function handler (data : Data) : Promise<void> {
            return UsersDb.removeFriend(data.userId, data.friendId)
                .then(() => {
                    UsersDb.removeFriend(data.friendId, data.userId);
                });
        }
    }
}

export = UsersController;