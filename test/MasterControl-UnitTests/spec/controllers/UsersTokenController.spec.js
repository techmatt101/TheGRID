var should = require("should");
var sinon = require("sinon");
var shouldPromised = require("should-promised");

var srcPath = '../../../../src/MasterControl-App/build/';

var UsersTokenController = require(srcPath + 'controllers/UsersTokenController');
var AuthTokenService = require(srcPath + 'services/AuthTokenService');


describe('Users Token Controller', function() {

    describe('Generate new user token', function() {
        var promise1, promise2;
        before(function() {
            promise1 = UsersTokenController.New.handler();
            promise2 = UsersTokenController.New.handler();
        });

        it("returns string token", function() {
            return promise1.should.finally.have.property('token').and.be.String;
        });

        it("returns unique string tokens", function() {
            return Promise.all([
                promise1, promise2
            ]).then(function(results) {
                var firstToken = results[0].token;
                var secondToken = results[1].token;
                firstToken.should.and.not.equal(secondToken);
            });
        });
    });

    describe('Get user token', function() {
        context('when given unexpired token', function() {
            var promise;
            before(function() {
                sinon.stub(AuthTokenService, 'getToken', function() {
                    return { data: '123' };
                });
                promise = UsersTokenController.Get.handler({ token: '12345678' });
            });

            it("returns token data", function() {
                return promise.should.finally.eql({ data: '123' });
            });

            after(function() {
                AuthTokenService.getToken.restore();
            });
        });

        context('when given expired token', function() {
            var promise;
            before(function() {
                promise = UsersTokenController.Get.handler({ token: '12345678' });
            });

            it("returns error", function() {
                return promise.should.be.rejected;
            });
        });
    });

    describe('Update user token data', function() {
        var mockUpdateData = {
            token: '12345678',
            data: {
                userId: '34jhb234',
                canceled: false
            }
        };

        context('when given unexpired token', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(AuthTokenService, 'getToken', function() {
                    return { data: '1234' };
                });
                promise = UsersTokenController.Update.handler(mockUpdateData);
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });

            it("returns token data", function() {
                stub.firstCall.args.should.eql(['12345678']);
            });

            after(function() {
                AuthTokenService.getToken.restore();
            });
        });

        context('when given expired token', function() {
            var promise;
            before(function() {
                promise = UsersTokenController.Update.handler(mockUpdateData);
            });

            it("returns error", function() {
                return promise.should.be.rejected;
            });
        });
    });
});