var should = require("should");
var sinon = require("sinon");
var sinonPromise = require('sinon-promise');
sinonPromise(sinon);

var srcPath = '../../../../src/MasterControl-App/build/';

var NotificationsController = require(srcPath + 'controllers/NotificationsController');
var NotificationsDbService = require(srcPath + 'services/NotificationsDbService');

var NotificationsMockData = require('../../mock-data/NotificationsMockData');


describe('Notifications Controller', function() {

    describe('Create new notification', function() {
        context('when given new notification info', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(NotificationsDbService, 'createNotification', sinon.promise().resolves(NotificationsMockData.dbNotification));
                promise = NotificationsController.New.handler({
                    userId: '53434',
                    type: 0,
                    message: 'message'
                });
            });

            after(function() {
                NotificationsDbService.createNotification.restore();
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });

            it("creates new notification in database", function() {
                stub.firstCall.args[0].should.have.properties(['user', 'type', 'message', 'date_created']); //TODO: hmmm...
            });
        });
    });

    describe('Get list of notifications', function() {
        context('when given user id', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(NotificationsDbService, 'getNotificationsByUser', sinon.promise().resolves([
                    NotificationsMockData.dbNotification, NotificationsMockData.dbNotification, NotificationsMockData.dbNotification
                ]));
                promise = NotificationsController.Get.handler({ userId: '1235' });
            });

            after(function() {
                NotificationsDbService.getNotificationsByUser.restore();
            });

            it("returns list of 3 notifications", function() {
                return promise.should.finally.property('notifications').and.have.lengthOf(3);
            });

            it("returns list of notifications", function() {
                return promise.should.finally.property('notifications').containEql(NotificationsMockData.mappedNotification);
            });
        });
    });
});