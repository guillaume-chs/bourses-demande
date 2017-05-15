'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Joi = require('joi');

// Create a server with a host and port
const server = new Hapi.Server();   
server.connection({
    host: 'localhost',
    port: 81
});

server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {
    if (err) throw err;

    // require('./app/users.js')(server);
    // require('./app/anecdotes.js')(server);

    server.start((err) => {
        if (err) throw err;
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
