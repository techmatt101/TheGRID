function DashboardController (server : Hapi.Server) {
    // Activity
    server.route({
        method: 'GET',
        path: '/activity',
        handler: (request, reply) => {
            reply.view('dashboard/activity');
        },
        config: { id: 'activity' }
    });
}

export = DashboardController;