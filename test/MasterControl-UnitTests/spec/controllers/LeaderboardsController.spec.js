var should = require("should");
var sinon = require("sinon");
var sinonPromise = require('sinon-promise');
sinonPromise(sinon);

var srcPath = '../../../../src/MasterControl-App/build/';

var LeaderboardsController = require(srcPath + 'controllers/LeaderboardsController');
var ActivitiesController = require(srcPath + 'controllers/ActivitiesController');
var LeaderboardsDbService = require(srcPath + 'services/LeaderboardsDbService');
var GamesDbService = require(srcPath + 'services/GamesDbService');
var UsersDbService = require(srcPath + 'services/UsersDbService');
var PlayerDataDbService = require(srcPath + 'services/PlayerDataDbService');

var LeaderboardsMockData = require('../../mock-data/LeaderboardsMockData');
var GamesMockData = require('../../mock-data/GamesMockData');
var UsersMockData = require('../../mock-data/UsersMockData');
var PlayerDataMockData = require('../../mock-data/PlayerDataMockData');


describe('Leaderboards Controller', function() {

    describe('Get leaderboard details', function() {
        context('when given leaderboard id', function() {
            var promise, stub;

            before(function() {
                stub = sinon.stub(LeaderboardsDbService, 'getLeaderboard', sinon.promise().resolves(LeaderboardsMockData.dbLeaderboard));
                promise = LeaderboardsController.Info.handler({ id: '123' });
            });

            after(function() {
                LeaderboardsDbService.getLeaderboard.restore();
            });

            it("returns game details", function() {
                return promise.should.finally.eql(LeaderboardsMockData.mappedLeaderboard);
            });
        });
    });

    describe('Create new leaderboard', function() {
        context('when given new leaderboard info', function() {
            var promise, leaderboardStub, gameStub;
            before(function() {
                leaderboardStub = sinon.stub(LeaderboardsDbService, 'createLeaderboard', sinon.promise().resolves(LeaderboardsMockData.dbLeaderboard));
                gameStub = sinon.stub(GamesDbService, 'addLeaderboard', sinon.promise().resolves());
                promise = LeaderboardsController.Create.handler({
                    gameId: '45345',
                    name: 'Highscore'
                });
            });

            after(function() {
                LeaderboardsDbService.createLeaderboard.restore();
                GamesDbService.addLeaderboard.restore();
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });

            it("creates new game in database", function() {
                leaderboardStub.firstCall.args.should.eql([{
                    game: '45345',
                    name: 'Highscore',
                    scores: []
                }]);
            });

            it("adds the leaderboard to game", function() {
                gameStub.called.should.be.true;
            });
        });
    });

    describe('Delete leaderboard', function() {
        context('when given leaderboard id', function() {
            var promise, leaderboardStub, gameStub;
            before(function() {
                leaderboardStub = sinon.stub(LeaderboardsDbService, 'deleteLeaderboard', sinon.promise().resolves(LeaderboardsMockData.dbLeaderboard));
                gameStub = sinon.stub(GamesDbService, 'removeLeaderboard', sinon.promise().resolves());
                promise = LeaderboardsController.Delete.handler({ id: '123' });
            });

            after(function() {
                LeaderboardsDbService.deleteLeaderboard.restore();
                GamesDbService.removeLeaderboard.restore();
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });

            it("removes leaderboard from database", function() {
                leaderboardStub.called.should.be.true;
            });

            it("removes the leaderboard from game", function() {
                gameStub.called.should.be.true;
            });
        });
    });

    describe('List scores', function() {
        before(function() {
            sinon.stub(LeaderboardsDbService, 'getLeaderboardWithScores', sinon.promise().resolves(LeaderboardsMockData.dbLeaderboardWithScores));
            sinon.stub(UsersDbService, 'getUserById', sinon.promise().resolves(UsersMockData.dbUser));
        });

        after(function() {
            LeaderboardsDbService.getLeaderboardWithScores.restore();
            UsersDbService.getUserById.restore();
        });

        context('when given leaderboard id', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Scores.handler({ id: '3453' });
            });

            it("returns full list of scores", function() {
                return promise.should.finally.have.property('scores').and.have.lengthOf(7);
            });

            it("returns full list of scores in sort of highest score", function() {
                return promise.then(function(data) {
                    var lastVal = 10000000;
                    var results = data.scores.filter(function(x) {
                        if(lastVal > x.value){
                            lastVal = x.value;
                            return true;
                        }
                        return false;
                    });
                    results.length.should.equal(data.scores.length);
                });
            });

            it("returns full list of scores with positions", function() {
                return promise.then(function(data) {
                    var lastVal = 0;
                    var results = data.scores.filter(function(x) {
                        if(lastVal < x.position){
                            lastVal = x.position;
                            return true;
                        }
                        return false;
                    });
                    results.length.should.equal(data.scores.length);
                });
            });
        });

        context('when per page of 3', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Scores.handler({
                    id: '3453',
                    perPage: 3
                });
            });

            it("returns list of 3 scores", function() {
                return promise.should.finally.have.property('scores').and.have.lengthOf(3);
            });
        });

        context('when per page of 2 and page of 1', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Scores.handler({
                    id: '3453',
                    perPage: 2,
                    page: 1
                });
            });

            it("returns list of 2 scores", function() {
                return promise.should.finally.have.property('scores').and.have.lengthOf(2);
            });
        });

        context('when per page of 3 and page of 2', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Scores.handler({
                    id: '3453',
                    perPage: 3,
                    page: 2
                });
            });

            it("returns list of 1 scores", function() {
                return promise.should.finally.have.property('scores').and.have.lengthOf(1);
            });
        });

        context('when friends only', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Scores.handler({
                    id: '3453',
                    userId: '34jhb234',
                    friendsOnly: true
                });
            });

            it("returns list of 3 friends scores", function() {
                return promise.should.finally.have.property('scores').and.have.lengthOf(3);
            });

            it("returns full list of scores with positions", function() {
                return promise.then(function(data) {
                    var lastVal = 0;
                    var results = data.scores.filter(function(x) {
                        if(lastVal < x.position){
                            lastVal = x.position;
                            return true;
                        }
                        return false;
                    });
                    results.length.should.equal(data.scores.length);
                });
            });
        });

        context('when friends only with 5 per page', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Scores.handler({
                    id: '3453',
                    userId: '34jhb234',
                    showPlayer: true,
                    perPage: 5
                });
            });

            it("returns middle value as players score", function() {
                return promise.should.finally.have.property('scores').and.property('2').and.property('userId').and.be.equal('34jhb234');
            });

            it("returns list of 5 friends scores", function() {
                return promise.should.finally.have.property('scores').and.have.lengthOf(5);
            });
        });
    });

    describe('Get users score', function() {
        before(function() {
            sinon.stub(PlayerDataDbService, 'getPlayerData', sinon.promise().resolves(PlayerDataMockData.dbPlayerData));
        });

        after(function() {
            PlayerDataDbService.getPlayerData.restore();
        });

        context('when user has score', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Score.handler({
                    id: 'kj4h5k6',
                    userId: 'j43dr33'
                });
            });

            it("returns score", function() {
                return promise.should.finally.have.properties(['dateAchieved', 'score']);
            });
        });

        context('when user has no score', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Score.handler({
                    id: '123',
                    userId: 'j43dr33'
                });
            });

            it("returns score", function() {
                return promise.should.be.rejected;
            });
        });
    });

    describe('Submit score to leaderboard', function() {
        var addLeaderboardScoreStub, addPlayerScoreStub, updateLeaderboardScoresStub, updatePlayerScoresStub, newActivityStub;
        before(function() {
            sinon.stub(LeaderboardsDbService, 'getLeaderboard', sinon.promise().resolves(LeaderboardsMockData.dbLeaderboard));
            sinon.stub(GamesDbService, 'getGame', sinon.promise().resolves(GamesMockData.dbGame));
            sinon.stub(UsersDbService, 'getUserById', sinon.promise().resolves(UsersMockData.dbUser));
            sinon.stub(PlayerDataDbService, 'getPlayerData', sinon.promise().resolves(PlayerDataMockData.dbPlayerData));

            addLeaderboardScoreStub = sinon.stub(LeaderboardsDbService, 'addScore', sinon.promise().resolves());
            addPlayerScoreStub = sinon.stub(PlayerDataDbService, 'addScore', sinon.promise().resolves());
            updateLeaderboardScoresStub = sinon.stub(LeaderboardsDbService, 'updateScores', sinon.promise().resolves());
            updatePlayerScoresStub = sinon.stub(PlayerDataDbService, 'updateScores', sinon.promise().resolves());

            newActivityStub = sinon.stub(ActivitiesController.New, 'handler', sinon.promise().resolves());
        });

        after(function() {
            LeaderboardsDbService.getLeaderboard.restore();
            GamesDbService.getGame.restore();
            UsersDbService.getUserById.restore();
            PlayerDataDbService.getPlayerData.restore();

            LeaderboardsDbService.addScore.restore();
            PlayerDataDbService.addScore.restore();
            LeaderboardsDbService.updateScores.restore();
            PlayerDataDbService.updateScores.restore();

            ActivitiesController.New.handler.restore();
        });

        context('when score is greater then previous', function() {
            var promise;
            before(function() {
                updateLeaderboardScoresStub.reset();
                updatePlayerScoresStub.reset();
                newActivityStub.reset();
                promise = LeaderboardsController.SubmitScore.handler({
                    id: 'l3l4j2',
                    userId: 'j43dr33',
                    score: 9001 //it's over 9000!!!
                });
            });

            it("updates leaderboard score", function() {
                updateLeaderboardScoresStub.called.should.be.true;
            });

            it("updates players data score", function() {
                updatePlayerScoresStub.called.should.be.true;
            });

            it("creates a new activity", function() {
                newActivityStub.called.should.be.true;
            });

            it("returns successful", function() {
                return promise.should.be.fulfilled;
            });
        });

        context('when score is less than previous', function() {
            var promise;
            before(function() {
                updateLeaderboardScoresStub.reset();
                updatePlayerScoresStub.reset();
                newActivityStub.reset();
                promise = LeaderboardsController.SubmitScore.handler({
                    id: 'l3l4j2',
                    userId: 'j43dr33',
                    score: 3453
                });
            });

            it("doesn't update leaderboard score", function() {
                updateLeaderboardScoresStub.called.should.be.true;
            });

            it("doesn't update players data score", function() {
                updatePlayerScoresStub.called.should.be.true;
            });

            it("doesn't create new activity", function() {
                newActivityStub.called.should.be.true;
            });

            it("returns successful", function() {
                return promise.should.be.fulfilled;
            });
        });

        context('when first time submitting score for user', function() {
            var promise;
            before(function() {
                addLeaderboardScoreStub.reset();
                addPlayerScoreStub.reset();
                newActivityStub.reset();
                promise = LeaderboardsController.SubmitScore.handler({
                    id: 'l3j45k5',
                    userId: '6jk34h45',
                    score: 3453
                });
            });

            it("adds score to leaderboard", function() {
                addLeaderboardScoreStub.called.should.be.true;
            });

            it("adds score to player data", function() {
                addPlayerScoreStub.called.should.be.true;
            });

            it("creates a new activity", function() {
                newActivityStub.called.should.be.true;
            });

            it("returns successful", function() {
                return promise.should.be.fulfilled;
            });
        });
    });
});