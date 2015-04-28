import services = require('services');

function AccountController (server : Hapi.Server, MasterControlService : services.MasterControlService) {
    // Register
    server.route({
        method: 'GET',
        path: '/join',
        handler: (request, reply) => {
            reply.view('account/register');
        },
        config: { id: 'register' }
    });

    server.route({
        method: 'POST',
        path: '/join',
        handler: (request, reply) => {
            MasterControlService.createNewUser({
                username: '',
                fullName: '',
                email: '',
                password: '',
                developer: false
            })
                .then((userId) => {
                    request.auth.session.set({ id: userId });
                    reply.redirect('/activity');
                })
                .catch((err) => {
                    console.error(err);
                    reply.redirect('/login');
                });
        }
    });

    // Login
    server.route({
        method: 'GET',
        path: '/login',
        handler: (request, reply) => {
            reply.view('account/login');
        },
        config: { id: 'login' }
    });

    server.route({
        method: 'POST',
        path: '/login',
        handler: (request : Hapi.Request, reply) => {
            MasterControlService.testLoginDetails({
                username: request.payload.username,
                password: request.payload.password,
            })
                .then((user) => {
                    request.auth.session.set({
                        id: user.id,
                        developer: user.developer
                    });
                    reply.redirect('/activity');
                })
                .catch((err) => {
                    console.error(err);
                    reply.redirect('/login');
                });
        }
    });

    // Logout
    server.route({
        method: 'GET',
        path: '/logout',
        handler: (request, reply) => {
            request.auth.session.clear();
            reply.redirect('/');
        }
    });

    // Profile

    server.route({
        method: 'GET',
        path: '/profile',
        handler: (request, reply) => {
            Promise.all<any>([
                MasterControlService.getUserDetails({ id: request.auth.credentials.id }),
                MasterControlService.getActivityFeed({ userId: request.auth.credentials.id })
            ])
                .then((results) => {
                    reply.view('account/profile', {
                        title: results[0].username,
                        user: results[0],
                        activities: results[1].activities
                    });
                })
                .catch((err) => {
                    console.error(err);
                    reply.redirect('/');
                });

        },
        config: { id: 'profile', auth: 'session' }
    });

    server.route({
        method: 'GET',
        path: '/profile/{username}',
        handler: (request, reply) => {
            MasterControlService.getUserDetails({ username: request.params.username })
                .then((user) => {
                    return MasterControlService.getActivityFeed({ userId: user.id })
                        .then((activity) => {
                            reply.view('account/profile', {
                                title: user.fullName,
                                user: user,
                                activities: activity.activities
                            });
                        });
                })
                .catch((err) => {
                    console.error(err);
                    reply.redirect('/');
                });
        },
        config: {
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

    server.route({
        method: 'GET',
        path: '/profile/settings',
        handler: (request, reply) => {
            MasterControlService.getUserDetails({ id: request.auth.credentials.id })
                .then((user) => {
                    reply.view('account/settings', { user: user });
                })
                .catch((err) => {
                    console.error(err);
                    reply.redirect('/');
                });
        },
        config: { id: 'settings', auth: 'session' }
    });


    // Game Login
    server.route({
        method: 'GET',
        path: '/external-login',
        handler: (request, reply) => {
            reply.view('account/external-login', { token: request.query.token });
        }
    });

    server.route({
        method: 'POST',
        path: '/external-login',
        handler: (request, reply) => {
            MasterControlService.testLoginDetails({
                username: request.payload.username,
                password: request.payload.password,
            })
                .then((user) => {
                    console.log(user, request.payload.token);
                    return MasterControlService.updateUserToken({ token: request.payload.token, data: { userId: user.id, canceled: false } })
                        .then(() => {
                            reply.view('auth/external-login-confirm');
                        });
                })
                .catch((err) => {
                    console.error(err);
                    reply.redirect('/external-login');
                });
        }
    });
}

export = AccountController;
