import Leaderboard = require('../Leaderboards/Leaderboard');
import User = require('../Users/User');

interface Game {
    id : string
    name : string
    description : string
    poster : string
    url : string
    categories : number[]
    leaderboards : Leaderboard[]
    developer : User
    published : boolean
}

export = Game;