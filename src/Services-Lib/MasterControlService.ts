import Service = require('./Service');
import MCRoutes = require('master-control');

class MasterControlService extends Service {

    requestLeaderboardScores(data : MCRoutes.Leaderboards.Scores.Data, callback : (err?, data? : MCRoutes.Leaderboards.Scores.Return) => void) {
        this._socket.send('leaderboards/scores', data, callback);
    }

    requestListOfGames(data : MCRoutes.Games.List.Data, callback : (err?, data? : MCRoutes.Games.List.Return) => void) {
        this._socket.send('games/list', data, callback);
    }
}

export = MasterControlService;