import Leaderboard = require('./Leaderboard');
import Score = require('./Score');
import User = require('../Users/User');

class Scores {
    private _scores : Score[] = [];
    private _sorted = false;
    private _positionsSet = false;

    constructor(leaderboard : Leaderboard) {
        this._scores = leaderboard.scores;
    }

    filterByFriends (user : User) {
        this._scores = this._scores.filter((x) => (user.friendIds.indexOf(x.userId) !== -1 || x.userId === user.id));
        return this;
    }

    sortByDefault() {
        this.sortByAscending();
        return this;
    }

    sortByAscending () {
        this._scores.sort((a, b) => {
            if (a.value < b.value) return 1;
            if (a.value > b.value) return -1;
            return 0;
        });
        this._sorted = true;
        return this;
    }

    sortByDescending () {
        this._scores.sort((a, b) => {
            if (a.value < b.value) return 1;
            if (a.value > b.value) return -1;
            return 0;
        });
        this._sorted = true;
        return this;
    }

    trim (page, perPage) {
        if(!this._sorted) this.sortByDefault();
        this._scores = this._scores.slice(page * perPage, (page + 1) * perPage);
        return this;
    }

    trimToPlayer (userId, perPage) {
        var userPos = this._scores.findIndex((x) => x.userId === userId);
        this.trim(Math.floor(userPos / perPage), perPage);
        return this;
    }

    updatePositions () {
        if(!this._sorted) this.sortByDefault();
        for (var i = 0; i < this._scores.length; i++) {
            this._scores[i].position = i + 1;
        }
        this._positionsSet = true;
        return this;
    }

    toArray () {
        if(!this._sorted) this.sortByDefault();
        if(!this._positionsSet) this.updatePositions();
        return this._scores;
    }
}

export = Scores;