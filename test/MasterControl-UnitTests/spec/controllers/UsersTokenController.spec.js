var should = require("should");
var sinon = require("sinon");
var Response = require('../../helpers/Response');

var srcPath = '../../../../src/MasterControl-App/build/';

var UsersTokenController = require(srcPath + 'controllers/UsersTokenController');
var AuthTokenService = require(srcPath + 'services/AuthTokenService');


describe('Users Token Controller', function() {

    describe('New', function() {
        it("returns a unique token", function(done) {
            var firstResponse = new Response();
            var secondResponse = new Response();

            UsersTokenController.New.handler(firstResponse);

            firstResponse.onReply = function() {
                var firstToken = firstResponse.data.should.have.property('token');
                UsersTokenController.New.handler(secondResponse);

                secondResponse.onReply = function() {
                    secondResponse.data.should.have.property('token').and.not.equal(firstToken);
                    done();
                };
            };
        });
    });

    describe('Get', function() {
        context('when given unexpired token', function() {
            it("returns token data", function() {
                var response = new Response();
                sinon.stub(AuthTokenService, 'getToken', function() {
                    return { data: '123' };
                });
                UsersTokenController.Get.handler(response, { token: '12345678' });

                response.hasErrors.should.be.false;
                response.data.should.eql({ data: '123' });
            });

            afterEach(function() {
                AuthTokenService.getToken.restore();
            });
        });

        context('when given expired token', function() {
            it("returns token data", function() {
                var response = new Response();
                UsersTokenController.Get.handler(response, { token: '12345678' });

                response.hasErrors.should.be.true;
            });
        });
    });

    describe('Update', function() {
        var mockUpdateData = {
            token: '12345678',
            data: {
                id: '34jhb234',
                canceled: false
            }
        };

        context('when given unexpired token', function() {
            it("returns token data", function() {
                var response = new Response();
                var stub = sinon.stub(AuthTokenService, 'getToken', function() {
                    return { data: '1234' };
                });

                UsersTokenController.Update.handler(response, mockUpdateData);

                stub.firstCall.args.should.eql(['12345678']);
                response.data.should.have.property('success').and.be.true;
            });

            afterEach(function() {
                AuthTokenService.getToken.restore();
            });
        });

        context('when given expired token', function() {
            it("returns token data", function() {
                var response = new Response();
                UsersTokenController.Update.handler(response, mockUpdateData);

                response.hasErrors.should.be.true;
            });
        });
    });
});