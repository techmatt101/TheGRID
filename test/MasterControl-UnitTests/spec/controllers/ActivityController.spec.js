var should = require("should");
var sinon = require("sinon");
var sinonPromise = require('sinon-promise');
sinonPromise(sinon);

var srcPath = '../../../../src/MasterControl-App/build/';

var ActivitiesController = require(srcPath + 'controllers/ActivitiesController');
var ActivitiesDbService = require(srcPath + 'services/ActivitiesDbService');
var UsersDbService = require(srcPath + 'services/UsersDbService');

var ActivitiesMockData = require('../../mock-data/ActivitiesMockData');
var UsersMockData = require('../../mock-data/UsersMockData');


describe('Activities Controller', function() {

    describe('Create new activity', function() {
        context('when given new activity info', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(ActivitiesDbService, 'createActivity', sinon.promise().resolves(ActivitiesMockData.dbActivity));
                promise = ActivitiesController.New.handler({
                    userId: '6334234',
                    type: 0,
                    message: 'message'
                });
            });

            after(function() {
                ActivitiesDbService.createActivity.restore();
            });

            it("returns success", function() {
                return promise.should.finally.be.a.String;
            });

            it("creates new activity in database", function() {
                stub.firstCall.args[0].should.have.properties(['user', 'type', 'message', 'date_created', 'likes', 'comments']); //TODO: hmmm...
            });
        });
    });

    describe('Get activities feed', function() {
        context('when given user id', function() {
            var promise, stub;
            before(function() {
                sinon.stub(UsersDbService, 'getUserById', sinon.promise().resolves(UsersMockData.dbUser));
                stub = sinon.stub(ActivitiesDbService, 'getActivitiesByUser', sinon.promise().resolves([
                    ActivitiesMockData.dbActivity, ActivitiesMockData.dbActivity, ActivitiesMockData.dbActivity
                ]));

            });

            after(function() {
                UsersDbService.getUserById.restore();
                ActivitiesDbService.getActivitiesByUser.restore();
            });

            it("should pass list of users friends to getActivitiesByUser to lookup activities", function() {
                promise = ActivitiesController.Feed.handler({
                    userId: '1235',
                    maxResults: 3
                });
                stub.firstCall.args.should.eql([UsersMockData.dbUser.friends, 3]);
            });

            it("returns list of 3 activities", function() {
                return promise.should.finally.property('activities').and.have.lengthOf(3);
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });
        });
    });

    describe('Like', function() {
        context('when given activity id and user id', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(ActivitiesDbService, 'addLike', sinon.promise().resolves());
                promise = ActivitiesController.Like.handler({
                    userId: '1235',
                    friendId: "6789"
                });
            });

            after(function() {
                ActivitiesDbService.addLike.restore();
            });

            it("saves like to database", function() {
                stub.called.should.be.true;
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });
        });
    });

    describe('Unlike', function() {
        context('when given activity id and user id', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(ActivitiesDbService, 'addLike', sinon.promise().resolves());
                promise = ActivitiesController.Like.handler({
                    userId: '1235',
                    friendId: "6789"
                });
            });

            after(function() {
                ActivitiesDbService.addLike.restore();
            });

            it("saves unlike to database", function() {
                stub.called.should.be.true;
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });
        });
    });

    describe('Comment', function() {
        context('when given activity id and comment info', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(ActivitiesDbService, 'addComment', sinon.promise().resolves());
                promise = ActivitiesController.Comment.handler({
                    activityId: '1235',
                    comment: [
                        ActivitiesMockData.dbComment, ActivitiesMockData.dbComment, ActivitiesMockData.dbComment
                    ]
                });
            });

            after(function() {
                ActivitiesDbService.addComment.restore();
            });

            it("saves comment to database", function() {
                stub.called.should.be.true;
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });
        });
    });
});