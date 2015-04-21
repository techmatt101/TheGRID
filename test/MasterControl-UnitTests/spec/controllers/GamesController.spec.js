var should = require("should");
var sinon = require("sinon");
var sinonPromise = require('sinon-promise');
sinonPromise(sinon);

var srcPath = '../../../../src/MasterControl-App/build/';

var GamesController = require(srcPath + 'controllers/GamesController');
var GamesDbService = require(srcPath + 'services/GamesDbService');
var CategoriesDbService = require(srcPath + 'services/CategoriesDbService');

var GamesMockData = require('../../mock-data/GamesMockData');


describe('Games Controller', function() {

    describe('Get game details', function() {
        context('when given game id', function() {
            var promise, stub;

            before(function() {
                stub = sinon.stub(GamesDbService, 'getGame', sinon.promise().resolves(GamesMockData.dbGame));
                promise = GamesController.Info.handler({ id: '123' });
            });

            after(function() {
                GamesDbService.getGame.restore();
            });

            it("returns game details", function() {
                return promise.should.finally.eql(GamesMockData.mappedGame);
            });
        });
    });

    describe('List games', function() {
        context('when given game ids', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(GamesDbService, 'getGames', sinon.promise().resolves([
                    GamesMockData.dbGame, GamesMockData.dbGame, GamesMockData.dbGame
                ]));
                promise = GamesController.List.handler({
                    ids: ['1235', '4566', '76534']
                });
            });

            after(function() {
                GamesDbService.getGames.restore();
            });

            it("returns list of 3 games", function() {
                return promise.should.finally.property('games').and.have.lengthOf(3);
            });

            it("returns list of games", function() {
                return promise.should.finally.property('games').containEql(GamesMockData.mappedGame);
            });
        });
    });

    describe('Search games', function() {
        context('when given search text and max results to be returned', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(GamesDbService, 'searchPublishedGames', sinon.promise().resolves([
                    GamesMockData.dbGame, GamesMockData.dbGame, GamesMockData.dbGame
                ]));
                promise = GamesController.Search.handler({
                    search: 'tron',
                    maxResults: 5
                });
            });

            after(function() {
                GamesDbService.searchPublishedGames.restore();
            });

            it("returns list of 3 games", function() {
                return promise.should.finally.property('games').and.have.lengthOf(3);
            });

            it("returns list of games", function() {
                return promise.should.finally.property('games').containEql(GamesMockData.mappedGame);
            });
        });
    });

    describe('Create new game', function() {
        context('when given new game info', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(GamesDbService, 'createGame', sinon.promise().resolves(GamesMockData.dbGame));
                promise = GamesController.Create.handler({
                    name: 'name',
                    developerId: '12345',
                    published: false,
                    description: 'description',
                    categories: [3, 6, 12],
                    url: 'http://www.foo.co.uk'
                });
            });

            after(function() {
                GamesDbService.createGame.restore();
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });

            it("creates new game in database", function() {
                stub.firstCall.args.should.eql([{
                    name: 'name',
                    published: false,
                    poster: null,
                    description: 'description',
                    categories: [3, 6, 12],
                    url: 'http://www.foo.co.uk',
                    leaderboards: [],
                    developer: '12345'
                }]);
            });
        });
    });

    describe('Delete game', function() {
        context('when given game id', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(GamesDbService, 'deleteGame', sinon.promise().resolves());
                promise = GamesController.Delete.handler({ id: '123' });
            });

            after(function() {
                GamesDbService.deleteGame.restore();
            });

            it("removes game from database", function() {
                stub.called.should.be.true;
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });
        });
    });

    describe('Update game details', function() {
        context('when given updated game info', function() {
            var promise, stub;
            before(function() {
                stub = sinon.stub(GamesDbService, 'updateGame', sinon.promise().resolves());
                promise = GamesController.Update.handler({
                    id: '34jhb234',
                    updatedData: {
                        name: 'name',
                        published: false,
                        description: 'description',
                        categories: [3, 6, 12],
                        url: 'http://www.foo.co.uk'
                    }
                });
            });

            after(function() {
                GamesDbService.updateGame.restore();
            });

            it("returns success", function() {
                return promise.should.be.fulfilled;
            });

            it("updates game info in database", function() {
                stub.firstCall.args.should.eql(["34jhb234", {
                    name: 'name',
                    published: false,
                    description: 'description',
                    categories: [3, 6, 12],
                    url: 'http://www.foo.co.uk'
                }]);
            });
        });
    });

    describe('List game categories', function() {
        var promise, mockCategoriesData = { categories: ["Category1", "Category2", "Cateory3"] };
        before(function() {
            sinon.stub(CategoriesDbService, 'getCategories', sinon.promise().resolves(mockCategoriesData));
            promise = GamesController.Categories.handler();
        });

        after(function() {
            CategoriesDbService.getCategories.restore();
        });

        it("returns categories", function() {
            return promise.should.finally.eql(mockCategoriesData);
        });
    });
});