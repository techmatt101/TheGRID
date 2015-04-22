import User = require('../Users/User');

interface Comment {
    id : string
    user : User
    message : string
    dateCreated : Date
}

export = Comment;