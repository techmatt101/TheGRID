/// <reference path="typings/tsd.d.ts" />
import config = require('config');
import mongoose = require('mongoose');
// Models
import Leaderboards = require('modules/Leaderboards');

mongoose.connect(config.get("mongodbServerUrl"), (err) => {
    if (err) throw err;
});

Leaderboards.getScoreList(1, (err, leaderboard) => {
    if (err) throw err;
    console.log(leaderboard);
});