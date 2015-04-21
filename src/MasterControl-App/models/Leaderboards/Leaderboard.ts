import Score = require('./Score');

interface Leaderboard {
    name : string;
    scores : Score[];
}

export = Leaderboard;