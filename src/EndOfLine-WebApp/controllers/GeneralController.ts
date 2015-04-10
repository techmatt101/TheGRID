function GeneralController (server : Hapi.Server) {
    // Style Guide
    server.route({
        method: 'GET',
        path: '/style-guide',
        handler: (request, reply) => {
            reply.view('style-guide');
        },
        config: { id: 'styleGuide' }
    });

    //Docs
    server.route({
        method: 'GET',
        path: '/docs',
        handler: (request, reply) => reply.redirect('http://docs.thegrid.apiary.io/'),
        config: { id: 'docs' }
    });

    // Home
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            reply.view('public/home');
        },
        config: { id: 'home' }
    });

    // Developers
    server.route({
        method: 'GET',
        path: '/dev',
        handler: (request, reply) => {
            reply.view('public/developers');
        },
        config: { id: 'developers' }
    });
}

export = GeneralController;