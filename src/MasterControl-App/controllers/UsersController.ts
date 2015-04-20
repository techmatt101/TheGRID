import validator = require('validator');
import parallel = require('promise-parallel');

import UsersDbService = require('../services/UsersDbService');
import AuthService = require('../services/AuthService');
import UsersMapper = require('../mappers/UsersMapper');
import NewUser = require('../models/NewUser');
import User = require('../models/User');

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

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            parallel([
                (data.username) ? UsersDbService.getUserByUsername(data.username) : null,
                (data.email) ? UsersDbService.getUserByEmail(data.email) : null
            ])
                .then((results) => {
                    var available = true;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i] !== null) {
                            available = false;
                            break;
                        }
                    }
                    reply({
                        available: available,
                        username: results[0] === null,
                        email: results[1] === null
                    });
                })
                .catch((err) => reply.error(err));
        }
    }

    export module Login {

        export var PATH = 'user/login';

        export interface Data {
            username : string
            password : string
        }
        export interface Return extends User {}

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            (validator.isEmail(data.username) ? UsersDbService.getUserByUsername(data.username) : UsersDbService.getUserByEmail(data.username))
                .then((userData) => UsersMapper.mapUserDbToUser(userData))
                .then((user) => AuthService.testPassword(user, data.password)
                    .then((result) => (result) ? Promise.resolve(user) : Promise.reject('Incorrect password')))
                .then((user) => UsersMapper.stripSensitiveData(user))
                .then((user) => reply(user))
                .catch((err) => reply.error(err));
        }
    }

    export module Info {

        export var PATH = 'user/info';

        export interface Data { id : string }
        export interface Return extends User {}

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            UsersDbService.getUserById(data.id)
                .then((user) => UsersMapper.mapUserDbToUser(user))
                .then((user) => UsersMapper.stripSensitiveData(user))
                .then((user) => reply(user))
                .catch((err) => reply.error(err));
        }
    }

    export module Create {

        export var PATH = 'user/create';

        export interface Data extends NewUser {}
        export interface Return { success : boolean }

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            AuthService.encryptAccount(data)
                .then((data) => UsersMapper.mapNewUserToUserDb(data))
                .then((data) => UsersDbService.createUser(data))
                .then(() => reply({ success: true }))
                .catch((err) => reply.error(err));
        }
    }

    export module Update {

        export var PATH = 'user/update';

        export interface Data extends User {}
        export interface Return { success : boolean }

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            UsersDbService.updateUser(data.id, UsersMapper.mapUserToDbUser(data))
                .then(() => reply({ success: true }))
                .catch((err) => reply.error(err));
        }
    }

    export module AddFriend {

        export var PATH = 'user/add-friend';

        export interface Data {
            userId : string
            friendId : string
        }
        export interface Return { success : boolean }

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            if(data.userId === data.friendId) return reply.error("User can't friend them selves");
            UsersDbService.addFriend(data.userId, data.friendId)
                .then(() => UsersDbService.addFriend(data.friendId, data.userId))
                .then(() => reply({ success: true }))
                .catch((err) => reply.error(err));
        }
    }

    export module RemoveFriend {

        export var PATH = 'user/remove-friend';

        export interface Data {
            userId : string
            friendId : string
        }
        export interface Return { success : boolean }

        export function handler (reply : SocketRouter.Reply<Return>, data : Data) {
            UsersDbService.removeFriend(data.userId, data.friendId)
                .then(() => UsersDbService.removeFriend(data.friendId, data.userId))
                .then(() => reply({ success: true }))
                .catch((err) => reply.error(err));
        }
    }
}

export = UsersController;