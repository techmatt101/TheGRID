function GeneralController (server : Hapi.Server) {
    // Home
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            reply.view('home');
        },
        config: {
            id: 'home',
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        }
    });

    // Developers
    server.route({
        method: 'GET',
        path: '/dev',
        handler: (request, reply) => {
            reply.view('developers');
        },
        config: {
            id: 'developers',
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        }
    });

    // Search
    server.route({
        method: 'GET',
        path: '/search',
        handler: (request, reply) => {
            reply.view('search');
        },
        config: {
            id: 'search',
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        }
    });

    // Help
    server.route({
        method: 'GET',
        path: '/help',
        handler: (request, reply) => {
            reply.view('help');
        },
        config: {
            id: 'help',
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        }
    });

    // Docs
    server.route({
        method: 'GET',
        path: '/docs',
        handler: (request, reply) => reply.redirect('http://docs.thegrid.apiary.io/'),
        config: { id: 'docs' }
    });

    // Style Guide
    server.route({
        method: 'GET',
        path: '/style-guide',
        handler: (request, reply) => {
            reply.view('style-guide');
        },
        config: { id: 'styleGuide' }
    });
}

export = GeneralController;