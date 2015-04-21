var LeaderboardsMockData = require('./LeaderboardsMockData');
var UsersMockData = require('./UsersMockData');
var data = {};

data.dbGame = {
    _id: '34523',
    name: 'game1',
    published: true,
    poster: 'http://image.com/img.jpg',
    description: 'description',
    url: 'http://example.game.co.uk/play',
    categories: [4, 7, 9, 3],
    leaderboards: [
        LeaderboardsMockData.dbLeaderboard,
        LeaderboardsMockData.dbLeaderboard,
        LeaderboardsMockData.dbLeaderboard
    ],
    developer: UsersMockData.dbUser
};

data.mappedGame = {
    id: '34523',
    name: 'game1',
    published: true,
    poster: 'http://image.com/img.jpg',
    description: 'description',
    url: 'http://example.game.co.uk/play',
    categories: [4, 7, 9, 3],
    leaderboards: [
        LeaderboardsMockData.mappedLeaderboard,
        LeaderboardsMockData.mappedLeaderboard,
        LeaderboardsMockData.mappedLeaderboard
    ],
    developer: UsersMockData.mappedUser
};

module.exports = data;