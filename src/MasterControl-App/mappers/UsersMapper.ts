import UsersDb = require('../services/UsersDbService')
import User = require('../models/User')
import NewUser = require('../models/NewUser');
import UpdateUser = require('../models/UpdateUser');

module UsersMapper {

    export function mapDbUserToUser (dbData : UsersDb.IUserDoc) : User {
        return {
            id: dbData._id,
            username: dbData.username,
            fullName: dbData.full_name,
            email: dbData.email,
            password: dbData.password || null,
            developer: dbData.developer,
            dateCreated: dbData.date_created,
            friendIds: dbData.friends
        };
    }

    export function stripSensitiveData (user : User) : User { //TODO: hmmm... should this logic be moved to the database schema?
        user.password = null;
        return user;
    }

    export function mapNewUserToDbUser (newUser : NewUser) : UsersDb.IUser {
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

    export function mapUpdateUserToDbUser (user : UpdateUser) : UsersDb.IUser {
        var obj : UsersDb.IUser = {};

        if (typeof user.fullName !== 'undefined')    obj.full_name = user.fullName;
        if (typeof user.email !== 'undefined')       obj.email = user.email;
        if (typeof user.password !== 'undefined')    obj.password = user.password;
        if (typeof user.developer !== 'undefined')    obj.developer = user.developer;

        return obj;
    }
}

export = UsersMapper;