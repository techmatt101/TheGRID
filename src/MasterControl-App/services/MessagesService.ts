import User = require('../models/Users/User');
import Game = require('../models/Games/Game');
import NewActivity = require('../models/Activities/NewActivity');

module MessagesService {
    export module Activities {
        export function firstScore(user : User, game : Game, score : number) : NewActivity {
            return {
                userId : user.id,
                type : 0,
                message : user.fullName + "'s first score of " + score + " playing " + game.name + "."
            };
        }

        export function beatScore(user : User, game : Game, newScore : number, oldScore : number) : NewActivity {
            return {
                userId : user.id,
                type : 1,
                message : user.fullName + "'s beat his high score of " + oldScore + " in " + game.name + " by " + (newScore - oldScore) + " with a new high score of " + newScore + "!"
            };
        }
    }
}

export = MessagesService;