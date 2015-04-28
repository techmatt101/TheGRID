import Service = require('./Service');
import MCRoutes = require('master-control');

class MasterControlService extends Service {

    //===================
    // Users
    //===================

    checkAvailability (data : MCRoutes.Users.Availability.Data) {
        return this._socket.send<MCRoutes.Users.Availability.Return>('user/availability', data);
    }

    testLoginDetails (data : MCRoutes.Users.Login.Data) {
        return this._socket.send<MCRoutes.Users.Login.Return>('user/login', data);
    }

    getUserDetails (data : MCRoutes.Users.Info.Data) {
        return this._socket.send<MCRoutes.Users.Info.Return>('user/info', data);
    }

    getListOfUsers (data : MCRoutes.Users.List.Data) {
        return this._socket.send<MCRoutes.Users.List.Return>('user/list', data);
    }

    searchUsers (data : MCRoutes.Users.Search.Data) {
        return this._socket.send<MCRoutes.Users.Search.Return>('user/search', data);
    }

    createNewUser (data : MCRoutes.Users.Create.Data) {
        return this._socket.send<string>('user/create', data);
    }

    updateUserDetails (data : MCRoutes.Users.Update.Data) {
        return this._socket.send<void>('user/update', data);
    }

    addFriendToUser (data : MCRoutes.Users.AddFriend.Data) {
        return this._socket.send<void>('user/add-friend', data);
    }

    removeFriendFromUser (data : MCRoutes.Users.RemoveFriend.Data) {
        return this._socket.send<void>('user/remove-friend', data);
    }


    //===================
    // Users Token
    //===================

    generateNewUserToken () {
        return this._socket.send<MCRoutes.UsersToken.New.Return>('user-token/new');
    }

    getUserToken (data : MCRoutes.UsersToken.Get.Data) {
        return this._socket.send<MCRoutes.UsersToken.Get.Return>('user-token/get', data);
    }

    updateUserToken (data : MCRoutes.UsersToken.Update.Data) {
        return this._socket.send<void>('user-token/update', data);
    }


    //===================
    // Games
    //===================

    getGameDetails (data : MCRoutes.Games.Info.Data) {
        return this._socket.send<MCRoutes.Games.Info.Return>('game/info', data);
    }

    getListOfGames (data : MCRoutes.Games.List.Data) {
        return this._socket.send<MCRoutes.Games.List.Return>('game/list', data);
    }

    searchGames (data : MCRoutes.Games.Search.Data) {
        return this._socket.send<MCRoutes.Games.Search.Return>('game/search', data);
    }

    createNewGame (data : MCRoutes.Games.Create.Data) {
        return this._socket.send<string>('game/create', data);
    }

    deleteGame (data : MCRoutes.Games.Delete.Data) {
        return this._socket.send<void>('game/delete', data);
    }

    updateGameDetails (data : MCRoutes.Games.Update.Data) {
        return this._socket.send<void>('game/update', data);
    }

    getListOfGameCategories () {
        return this._socket.send<MCRoutes.Games.Categories.Return>('game/categories');
    }


    //===================
    // Leaderboards
    //===================

    getLeaderboardDetails (data : MCRoutes.Leaderboards.Info.Data) {
        return this._socket.send<MCRoutes.Leaderboards.Info.Return>('leaderboard/info', data);
    }

    createNewLeaderboard (data : MCRoutes.Leaderboards.Create.Data) {
        return this._socket.send<string>('leaderboard/create', data);
    }

    deleteLeaderboard (data : MCRoutes.Leaderboards.Delete.Data) {
        return this._socket.send<void>('leaderboard/delete', data);
    }

    getScore (data : MCRoutes.Leaderboards.Score.Data) {
        return this._socket.send<MCRoutes.Leaderboards.Score.Return>('leaderboard/score', data);
    }

    getListOfScores (data : MCRoutes.Leaderboards.Scores.Data) {
        return this._socket.send<MCRoutes.Leaderboards.Scores.Return>('leaderboard/scores', data);
    }

    submitScore (data : MCRoutes.Leaderboards.SubmitScore.Data) {
        return this._socket.send<void>('leaderboard/submit-score', data);
    }


    //===================
    // Activities
    //===================

    createNewActivity (data : MCRoutes.Activities.New.Data) {
        return this._socket.send<string>('activity/new', data);
    }

    getActivityFeed (data : MCRoutes.Activities.Feed.Data) {
        return this._socket.send<MCRoutes.Activities.Feed.Return>('activity/feed', data);
    }

    likeActivity (data : MCRoutes.Activities.Like.Data) {
        return this._socket.send<void>('activity/like', data);
    }

    unlikeActivity (data : MCRoutes.Activities.Unlike.Data) {
        return this._socket.send<void>('activity/unlike', data);
    }

    commentOnActivity (data : MCRoutes.Activities.Feed.Data) {
        return this._socket.send<void>('activity/comment', data);
    }


    //===================
    // Notifications
    //===================

    createNewNotification (data : MCRoutes.Notifications.New.Data) {
        return this._socket.send<string>('notifications/new', data);
    }

    getNotifications (data : MCRoutes.Notifications.Get.Data) {
        return this._socket.send<MCRoutes.Notifications.Get.Return>('notifications/get', data);
    }
}

export = MasterControlService;