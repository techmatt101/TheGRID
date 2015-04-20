var should = require("should");
var sinon = require("sinon");
var sinonPromise = require('sinon-promise');
sinonPromise(sinon);
var Response = require('../../helpers/Response');

var srcPath = '../../../../src/MasterControl-App/build/';

var UsersController = require(srcPath + 'controllers/UsersController');
var UsersDbService = require(srcPath + 'services/UsersDbService');

var UsersMockData = require('../../mock-data/UsersMockData');


describe('Users Controller', function() {

    describe('Availability', function() {
        context('when given a unique username and email', function() {
            it("updates user info and returns success", function(done) {
                var response = new Response();

                sinon.stub(UsersDbService, 'getUserByUsername', sinon.promise().resolves(null));
                sinon.stub(UsersDbService, 'getUserByEmail', sinon.promise().resolves(null));

                UsersController.Availability.handler(response, {
                    username: 'username',
                    email: 'email'
                });

                response.onReply = function() {
                    response.hasErrors.should.be.false;
                    response.data.should.have.property('available').and.be.true;
                    response.data.should.have.property('username').and.be.true;
                    response.data.should.have.property('email').and.be.true;
                    done();
                };
            });
        });

        //TODO: when given used username and email
        //TODO: when given used username and unique email
        //TODO: when given only unique username

        afterEach(function() {
            UsersDbService.getUserByUsername.restore();
            UsersDbService.getUserByEmail.restore();
        });
    });

    describe('Login', function() {
        context('when given correct username and password', function(done) {
            it("returns user info", function(done) {
                var response = new Response();

                sinon.stub(UsersDbService, 'getUserByUsername', sinon.promise().resolves(UsersMockData.dbUser));
                sinon.stub(UsersDbService, 'getUserByEmail', sinon.promise().resolves(UsersMockData.dbUser));

                UsersController.Login.handler(response, {
                    username: 'username',
                    password: 'password'
                });

                response.onReply = function() {
                    response.hasErrors.should.be.false;
                    response.data.should.eql(UsersMockData.mappedUser);
                    done();
                };
            });
        });

        //TODO: when not given incorrect password
        //TODO: when given an email instead of username

        afterEach(function() {
            UsersDbService.getUserByUsername.restore();
            UsersDbService.getUserByEmail.restore();
        });
    });

    describe('Info', function() {
        context('when given user id', function() {
            it("returns user info", function() {
                var response = new Response();
                var stub = sinon.stub(UsersDbService, 'getUserById', sinon.promise().resolves(UsersMockData.dbUser));
                UsersController.Info.handler(response, { id: '123' });

                response.hasErrors.should.be.false;
                stub.firstCall.args.should.eql(['123']);
                response.data.should.eql(UsersMockData.mappedUser);
            });

            afterEach(function() {
                UsersDbService.getUserById.restore();
            });
        });
    });

    describe('Create', function() {
        context('when given new user info', function() {
            it("creates new user and returns success", function(done) {
                var response = new Response();
                var stub = sinon.stub(UsersDbService, 'createUser', sinon.promise().resolves());

                UsersController.Create.handler(response, {
                    username: 'username',
                    fullName: 'full_name',
                    email: 'email',
                    password: 'password',
                    developer: false
                });

                response.onReply = function() {
                    response.hasErrors.should.be.false;
                    stub.firstCall.args[0].should.have.properties(['username', 'full_name', 'email', 'developer']);
                    stub.firstCall.args[0].should.have.property('password').and.not.equal('password');
                    response.data.should.have.property('success').and.be.true;
                    done();
                };
            });
        });

        //TODO: when not given all user info

        afterEach(function() {
            UsersDbService.createUser.restore();
        });
    });

    describe.skip('Update', function() {
        context('when given new user info', function() {
            it("updates user info and returns success", function() {
                var response = new Response();
                var stub = sinon.stub(UsersDbService, 'updateUser', sinon.promise().resolves());

                UsersController.Update.handler(response, {
                    id: '34jhb234',
                    fullName: 'full_name',
                    email: 'email',
                    password: 'password',
                    developer: false
                });

                response.hasErrors.should.be.false;
                stub.firstCall.args.should.eql(["34jhb234", {
                    developer: false,
                    email: "email",
                    full_name: "full_name",
                    password: "password"
                }]);
                response.data.should.have.property('success').and.be.true;
            });
        });

        //TODO: when given half of user info
        //TODO: when not given user info

        afterEach(function() {
            UsersDbService.updateUser.restore();
        });
    });

    describe('AddFriend', function() {
        context('when given user id and friend id', function() {
            it("it updates user with new friend", function() {
                var response = new Response();
                var stub = sinon.stub(UsersDbService, 'addFriend', sinon.promise().resolves());

                UsersController.AddFriend.handler(response, {
                    userId: '1235',
                    friendId:"6789"
                });

                response.hasErrors.should.be.false;
                stub.calledTwice.should.be.true;
                response.data.should.have.property('success').and.be.true;
            });
        });

        context('when given the same user id and friend id', function() {
            it("it updates user with new friend", function() {
                var response = new Response();
                sinon.stub(UsersDbService, 'addFriend', sinon.promise().resolves());

                UsersController.AddFriend.handler(response, {
                    userId: '1235',
                    friendId:"1235"
                });

                response.hasErrors.should.be.true;
            });
        });

        afterEach(function() {
            UsersDbService.addFriend.restore();
        });
    });

    describe('RemoveFriend', function() {
        context('when given user id and friend id', function() {
            it("it removes friend from user", function() {
                var response = new Response();
                var stub = sinon.stub(UsersDbService, 'removeFriend', sinon.promise().resolves());

                UsersController.RemoveFriend.handler(response, {
                    userId: '1235',
                    friendId:"6789"
                });

                response.hasErrors.should.be.false;
                stub.calledTwice.should.be.true;
                response.data.should.have.property('success').and.be.true;
            });
        });

        afterEach(function() {
            UsersDbService.removeFriend.restore();
        });
    });
});