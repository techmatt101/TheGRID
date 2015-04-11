import Service = require('./Service');
import MCRoutes = require('master-control');

class MasterControlService extends Service {

    requestLeaderboardScores (data : MCRoutes.Leaderboards.Scores.Data) {
        return this._socket.send<MCRoutes.Leaderboards.Scores.Return>('leaderboards/scores', data);
    }

    requestListOfGames (data : MCRoutes.Games.List.Data){
        return this._socket.send<MCRoutes.Games.List.Return>('games/list', data);
    }
}

export = MasterControlService;