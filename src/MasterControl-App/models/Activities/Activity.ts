import ActivityComment = require('./Comment');
import User = require('../Users/User');

interface Activity {
    id : string
    user : User
    type : number
    message : string
    dateCreated : Date
    likes : number
    comments : ActivityComment[]
}

export = Activity;