var clone = require("clone");
var should = require("should");
var sinon = require("sinon");
var shouldPromised = require("should-promised");
var sinonPromise = require('sinon-promise');
sinonPromise(sinon);

var srcPath = '../../../../src/MasterControl-App/build/';

var UsersController = require(srcPath + 'controllers/UsersController');
var UsersDbService = require(srcPath + 'services/UsersDbService');

var UsersMockData = require('../../mock-data/UsersMockData');


describe('Users Controller', function() {

    describe('Check user availability', function() {
        var promise, getUserByUsernamePromise, getUserByEmailPromise;

        before(function() {
            getUserByUsernamePromise = sinon.promise();
            getUserByEmailPromise = sinon.promise();

            sinon.stub(UsersDbService, 'getUserByUsername', getUserByUsernamePromise);
            sinon.stub(UsersDbService, 'getUserByEmail', getUserByEmailPromise);
        });

        after(function() {
            UsersDbService.getUserByUsername.restore();
            UsersDbService.getUserByEmail.restore();
        });

        context('when given a unique username and email', function() {
            before(function() {
                getUserByUsernamePromise.resolves(null);
                getUserByEmailPromise.resolves(null);

                promise = UsersController.Availability.handler({
                    username: 'username',
                    email: 'email'
                });
            });

            it("returns true for available", function() {
                return promise.should.finally.have.property('available').and.be.true;
            });

            it("returns true for username", function() {
                return promise.should.finally.have.property('username').and.be.true;
            });

            it("returns true for email", function() {
                return promise.should.finally.have.property('email').and.be.true;
            });
        });

        context('when given a used username and email', function() {
            before(function() {
                getUserByUsernamePromise.resolves(UsersMockData.dbUser);
                getUserByEmailPromise.resolves(UsersMockData.dbUser);

                promise = UsersController.Availability.handler({
                    username: 'username',
                    email: 'email'
                });
            });

            it("returns false for available", function() {
                return promise.should.finally.have.property('available').and.be.false;
            });

            it("returns false for username", function() {
                return promise.should.finally.have.property('username').and.be.false;
            });

            it("returns false for email", function() {
                return promise.should.finally.have.property('email').and.be.false;
            });
        });

        context('when given only unique username', function() {
            before(function() {
                getUserByUsernamePromise.resolves(null);
                promise = UsersController.Availability.handler({
                    username: 'username'
                });
            });

            it("returns true for available", function() {
                return promise.should.finally.have.property('available').and.be.true;
            });

            it("returns true for username", function() {
                return promise.should.finally.have.property('username').and.be.true;
            });
        });
    });

    describe('Login user', function() {
        var promise, getUserByUsernamePromise, getUserByEmailPromise;

        before(function() {
            getUserByUsernamePromise = sinon.promise();
            getUserByEmailPromise = sinon.promise();

            sinon.stub(UsersDbService, 'getUserByUsername', getUserByUsernamePromise);
            sinon.stub(UsersDbService, 'getUserByEmail', getUserByEmailPromise);
        });

        after(function() {
            UsersDbService.getUserByUsername.restore();
        });

        context('when given correct username and password', function() {
            before(function() {
                getUserByUsernamePromise.resolves(UsersMockData.dbUserWithPassword);
                promise = UsersController.Login.handler({
                    username: 'username',
                    password: 'password'
                });
            });

            it("returns user info", function() {
                return promise.should.finally.eql(UsersMockData.mappedUser);
            });
        });

        context('when given incorrect password', function() {
            before(function() {
                var userData = clone(UsersMockData.dbUser);
                userData.password = 'bad_password';
                getUserByUsernamePromise.resolves(userData);
                promise = UsersController.Login.handler({
                    username: 'username',
                    password: 'password'
                });
            });

            it("returns error", function() {
                return promise.should.be.rejected;
            });
        });

        context('when given an email instead of username', function() {
            before(function() {
                getUserByEmailPromise.resolves(UsersMockData.dbUserWithPassword);
                promise = UsersController.Login.handler({
                    username: 'foo@test.com',
                    password: 'password'
                });
            });

            it("returns user info", function() {
                return promise.should.finally.eql(UsersMockData.mappedUser);
            });
        });
    });

    describe('Get user details', function() {
        context('when given user id', function() {
            var promise, stub;

            before(function() {
                stub = sinon.stub(UsersDbService, 'getUserById', sinon.promise().resolves(UsersMockData.dbUser));
                promise = UsersController.Info.handler({ id: '123' });
            });

            after(function() {
                UsersDbService.getUserById.restore();
            });

            it("returns user details", function() {
                return promise.should.finally.eql(UsersMockData.mappedUser);
            });

            it("returns password as null", function() {
                return promise.should.finally.have.property('password').and.equal(null);
            });
        });
    });

    describe('List users', function() {
        context('when given user ids', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(UsersDbService, 'getUsers', sinon.promise().resolves([
                    UsersMockData.dbUser, UsersMockData.dbUser, UsersMockData.dbUser
                ]));
                promise = UsersController.List.handler({
                    ids: ['1235', '4566', '76534']
                });
            });

            after(function() {
                UsersDbService.getUsers.restore();
            });

            it("returns list of 3 users", function() {
                return promise.should.finally.property('users').and.have.lengthOf(3);
            });

            it("returns list of users with their details", function() {
                return promise.should.finally.property('users').containEql(UsersMockData.mappedUser);
            });

            it("returns password as null", function() {
                return promise.should.finally.have.property('users').and.have.property(0).and.have.property('password').and.equal(null);
            });
        });
    });

    describe('Search users', function() {
        context('when given search text and max results to be returned', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(UsersDbService, 'searchUsers', sinon.promise().resolves([
                    UsersMockData.dbUser, UsersMockData.dbUser, UsersMockData.dbUser
                ]));
                promise = UsersController.Search.handler({
                    search: 'tron',
                    maxResults: 3
                });
            });

            after(function() {
                UsersDbService.searchUsers.restore();
            });

            it("returns list of 3 users", function() {
                return promise.should.finally.property('users').and.have.lengthOf(3);
            });

            it("returns list of users with their details", function() {
                return promise.should.finally.property('users').containEql(UsersMockData.mappedUser);
            });

            it("returns password as null", function() {
                return promise.should.finally.have.property('users').and.have.property(0).and.have.property('password').and.equal(null);
            });
        });
    });

    describe('Create new user', function() {
        context('when given new user info', function() {
            var promise, stub;

            before(function() {
                stub = sinon.stub(UsersDbService, 'createUser', sinon.promise().resolves(UsersMockData.dbUser));
                promise = UsersController.Create.handler({
                    username: 'username',
                    fullName: 'full_name',
                    email: 'email',
                    password: 'password',
                    developer: false
                });
            });

            after(function() {
                UsersDbService.createUser.restore();
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });

            it("creates new user in database", function() {
                stub.firstCall.args[0].should.have.properties(['username', 'full_name', 'email', 'developer', 'date_created', 'friends']);
            });

            it("encrypts password before creating user", function() {
                stub.firstCall.args[0].should.have.property('password').and.not.equal('password');
            });
        });
    });

    describe('Update user details', function() {
        context('when given updated user info', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(UsersDbService, 'updateUser', sinon.promise().resolves());
                promise = UsersController.Update.handler({
                    id: '34jhb234',
                    updatedData: {
                        fullName: 'full_name',
                        email: 'email',
                        developer: false
                    }
                });
            });

            after(function() {
                UsersDbService.updateUser.restore();
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });

            it("updates user info in database", function() {
                stub.firstCall.args.should.eql(["34jhb234", {
                    developer: false,
                    email: "email",
                    full_name: "full_name"
                }]);
            });
        });

        context('when given new user info with password', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(UsersDbService, 'updateUser', sinon.promise().resolves());
                promise = UsersController.Update.handler({
                    id: '34jhb234',
                    updatedData: {
                        email: "email",
                        password: 'password'
                    }
                });
            });

            after(function() {
                UsersDbService.updateUser.restore();
            });

            it("encrypts password before updating user", function() {
                return promise.then(function() {
                    stub.firstCall.args[1].should.have.property('password').and.not.equal('password');
                });
            });
        });
    });

    describe('Add friend to user', function() {
        context('when given user id and friend id', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(UsersDbService, 'addFriend', sinon.promise().resolves());
                promise = UsersController.AddFriend.handler({
                    userId: '1235',
                    friendId: "6789"
                });
            });

            after(function() {
                UsersDbService.addFriend.restore();
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });

            it("add friend to both users", function() {
                stub.calledTwice.should.be.true;
            });
        });

        context('when given the same user id and friend id', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(UsersDbService, 'addFriend', sinon.promise().resolves());
                promise = UsersController.AddFriend.handler({
                    userId: '1235',
                    friendId: "1235"
                });
            });

            after(function() {
                UsersDbService.addFriend.restore();
            });

            it("returns error", function() {
                return promise.should.be.rejected;
            });
        });
    });

    describe('Remove friend from user', function() {
        context('when given user id and friend id', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(UsersDbService, 'removeFriend', sinon.promise().resolves());
                promise = UsersController.RemoveFriend.handler({
                    userId: '1235',
                    friendId: "6789"
                });
            });

            after(function() {
                UsersDbService.removeFriend.restore();
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });
        });
    });
});