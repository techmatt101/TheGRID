import services = require('services');

function ActivityController (server : Hapi.Server, MasterControlService : services.MasterControlService) {
    // Activity
    server.route({
        method: 'GET',
        path: '/activity',
        handler: (request, reply) => {
            ((request.auth.isAuthenticated) ? MasterControlService.getActivityFeed({ userId: request.auth.credentials.id, includeFriends: true }) : MasterControlService.getActivityFeed({}))
                .then((data) => reply.view('activity/activities', { activities: data.activities }))
                .catch((err) => reply(Boom.badImplementation()));  //TODO: hmmm....
        },
        config: {
            id: 'activity',
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
        path: '/notifications',
        handler: (request, reply) => {
            MasterControlService.getNotifications({ userId: request.auth.credentials.id })
                .then((data) => reply.view('activity/notifications', { notifications: data.notifications }))
                .catch((err) => reply(Boom.badImplementation()));  //TODO: hmmm....
        },
        config: { id: 'notifications', auth: 'session' }
    });
}

export = ActivityController;