import Score = require('./Score');

interface Leaderboard {
    id : string
    name : string;
    gameId : string;
    scores : Score[];
}

export = Leaderboard;