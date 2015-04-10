function AccountController (server : Hapi.Server) {
    // Register
    server.route({
        method: 'GET',
        path: '/join',
        handler: (request, reply) => {
            reply.view('public/register');
        },
        config: { id: 'register' }
    });

    // Login
    server.route({
        method: 'GET',
        path: '/login',
        handler: (request, reply) => {
            reply.view('public/login');
        },
        config: { id: 'login' }
    });

    server.route({
        method: 'POST',
        path: '/login',
        handler: (request, reply) => {
            reply.redirect('/');
        }
    });

    // Logout
    server.route({
        method: 'GET',
        path: '/logout',
        handler: (request, reply) => {
            request.session.reset();
            reply.redirect('/');
        }
    });

    // Settings
    server.route({
        method: 'GET',
        path: '/settings',
        handler: (request, reply) => {
            reply.view('dashboard/settings');
        },
        config: { id: 'settings' }
    });
}

export = AccountController;
