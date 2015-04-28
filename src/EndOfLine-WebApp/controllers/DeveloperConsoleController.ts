import services = require('services');

function DeveloperConsoleController (server : Hapi.Server, MasterControlService  : services.MasterControlService) {
    server.route({
        method: 'GET',
        path: '/console',
        handler: (request, reply) => {
            MasterControlService.getListOfGames({ userId: request.auth.credentials.id })
                .then((data) => reply.view('developer-console/dashboard', {
                    title: 'Console',
                    games: data.games
                }))
                .catch((err) => reply(Boom.badImplementation()));  //TODO: hmmm....
        },
        config: { id: 'console', auth: 'session' }
    });


    // Games
    server.route({
        method: 'GET',
        path: '/console/games/new',
        handler: (request, reply) => {
            reply.view('developer-console/new-game', { title: 'New Game'});
        },
        config: { auth: 'session' }
    });

    server.route({
        method: 'POST',
        path: '/console/games/new',
        handler: (request, reply) => {
            MasterControlService.createNewGame({
                name: request.payload.name,
                developerId: request.auth.credentials.id,
                published: request.payload.publish,
                description: request.payload.description,
                categories: request.payload.categories,
                url: request.payload.url
            })
                .then((id) => reply.redirect('/console/games/' + id))
                .catch((err) => reply(Boom.badImplementation()));  //TODO: hmmm....
        },
        config: { auth: 'session' }
    });

    server.route({
        method: 'GET',
        path: '/console/games/{gameId}',
        handler: (request, reply) => {
            MasterControlService.getGameDetails({ id: request.params.gameId })
                .then((game) => reply.view('developer-console/game', {
                    title: game.name,
                    game : game
                }))
                .catch((err) => reply(Boom.badImplementation()));  //TODO: hmmm....
        },
        config: { auth: 'session' }
    });


    // Leaderboards
    server.route({
        method: 'GET',
        path: '/console/leaderboards/new',
        handler: (request, reply) => {
            reply.view('developer-console/new-leaderboard', { title: 'New Leaderboard'});
        },
        config: { auth: 'session' }
    });

    server.route({
        method: 'POST',
        path: '/console/leaderboards/new',
        handler: (request, reply) => {
            MasterControlService.createNewLeaderboard({
                name: request.payload.name,
                gameId: request.payload.gameId
            })
                .then((id) => reply.redirect('/console/leaderboards/' + id))
                .catch((err) => reply(Boom.badImplementation()));  //TODO: hmmm....
        },
        config: { auth: 'session' }
    });

    server.route({
        method: 'GET',
        path: '/console/leaderboards/{leaderboardId}',
        handler: (request, reply) => {
            MasterControlService.getLeaderboardDetails({ id: request.params.leaderboardId })
                .then((leaderboard) => reply.view('developer-console/leaderboard', {
                    title: leaderboard.name,
                    game : leaderboard
                }))
                .catch((err) => reply(Boom.badImplementation()));  //TODO: hmmm....
        },
        config: { auth: 'session' }
    });
}

export = DeveloperConsoleController;