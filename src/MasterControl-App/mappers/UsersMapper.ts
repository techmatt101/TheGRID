import UsersDb = require('../services/UsersDbService')
import User = require('../models/User')
import NewUser = require('../models/NewUser');

module UsersMapper {
    export function mapUserDbToUser (dbData : UsersDb.IUserDoc) : User {
        return {
            id: dbData._id,
            username: dbData.username,
            fullName: dbData.full_name,
            email: dbData.email,
            password: dbData.password,
            developer: dbData.developer,
            date_created: dbData.date_created,
            friendIds: dbData.friends
        };
    }

    export function stripSensitiveData (user : User) : User {
        user.password = null;
        return user;
    }

    export function mapNewUserToUserDb (newUser : NewUser) : UsersDb.IUser {
        return {
            username: newUser.username,
            full_name: newUser.fullName,
            email: newUser.email,
            password: newUser.password,
            date_created: new Date(),
            developer: newUser.developer,
            friends: []
        };
    }

    export function mapUserToDbUser (user : User) : UsersDb.IUser {
        return {
            username: user.username,
            full_name: user.fullName,
            email: user.email,
            password: user.password,
            date_created: new Date(), //TODO: hmmm...
            developer: user.developer,
            friends: user.friendIds
        };
    }
}

export = UsersMapper;