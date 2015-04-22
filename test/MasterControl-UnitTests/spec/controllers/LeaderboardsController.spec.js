var should = require("should");
var sinon = require("sinon");
var sinonPromise = require('sinon-promise');
sinonPromise(sinon);

var srcPath = '../../../../src/MasterControl-App/build/';

var LeaderboardsController = require(srcPath + 'controllers/LeaderboardsController');
var LeaderboardsDbService = require(srcPath + 'services/LeaderboardsDbService');
var GamesDbService = require(srcPath + 'services/GamesDbService');
var UsersDbService = require(srcPath + 'services/UsersDbService');

var LeaderboardsMockData = require('../../mock-data/LeaderboardsMockData');
var UsersMockData = require('../../mock-data/UsersMockData');


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
        });

        context('when given id and maxResults of 3', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Scores.handler({
                    id: '3453',
                    maxResults: 3
                });
            });

            it("returns list of 3 scores", function() {
                return promise.should.finally.have.property('scores').and.have.lengthOf(3);
            });
        });

        context('when given id and maxResults of 4 and start of 1', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Scores.handler({
                    id: '3453',
                    maxResults: 4,
                    start: 1
                });
            });

            it("returns list of 4 scores", function() {
                return promise.should.finally.have.property('scores').and.have.lengthOf(4);
            });
        });

        context('when given id and maxResults of 3 and start of 6', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Scores.handler({
                    id: '3453',
                    maxResults: 3,
                    start: 6
                });
            });

            it("returns list of 1 scores", function() {
                return promise.should.finally.have.property('scores').and.have.lengthOf(1);
            });
        });

        context('when given id and userId and friendsOnly', function() {
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
        });

        context('when given id and userId and showPlayer and maxResults 5', function() {
            var promise;
            before(function() {
                promise = LeaderboardsController.Scores.handler({
                    id: '3453',
                    userId: '34jhb234',
                    showPlayer: true,
                    maxResults: 5
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

    describe('Submit score to leaderboard', function() {
        var addScoreStub, updateScoresStub;
        before(function() {
            sinon.stub(LeaderboardsDbService, 'getLeaderboardWithScores', sinon.promise().resolves(LeaderboardsMockData.dbLeaderboardWithScores));
            addScoreStub = sinon.stub(LeaderboardsDbService, 'addScore', sinon.promise().resolves());
            updateScoresStub = sinon.stub(LeaderboardsDbService, 'updateScores', sinon.promise().resolves());
            sinon.stub(UsersDbService, 'getUserById', sinon.promise().resolves(UsersMockData.dbUser));
        });

        after(function() {
            LeaderboardsDbService.getLeaderboardWithScores.restore();
            UsersDbService.getUserById.restore();
        });

        context('when score is greater then previous', function() {
            var promise;
            before(function() {
                updateScoresStub.reset();
                promise = LeaderboardsController.SubmitScore.handler({
                    id: '123',
                    userId: 'j43dr33',
                    score: 9001 //it's over 9000!!!
                });
            });

            it("updates score", function() {
                updateScoresStub.called.should.be.true;
            });

            it("returns successful", function() {
                return promise.should.be.fulfilled;
            });
        });

        context('when score is less than previous', function() {
            var promise;
            before(function() {
                updateScoresStub.reset();
                promise = LeaderboardsController.SubmitScore.handler({
                    id: '123',
                    userId: 'j43dr33',
                    score: 3453
                });
            });

            it("doesn't updates score", function() {
                updateScoresStub.called.should.be.true;
            });

            it("returns successful", function() {
                return promise.should.be.fulfilled;
            });
        });

        context('when first time submitting score for user', function() {
            var promise;
            before(function() {
                addScoreStub.reset();
                promise = LeaderboardsController.SubmitScore.handler({
                    id: '123',
                    userId: '6jk34h45',
                    score: 3453
                });
            });

            it("adds score to leaderboard", function() {
                addScoreStub.called.should.be.true;
            });

            it("returns successful", function() {
                return promise.should.be.fulfilled;
            });
        });
    });
});