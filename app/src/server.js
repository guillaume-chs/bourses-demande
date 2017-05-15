'use strict';

const Path = require('path');
const http = require('http');

const Hapi = require('hapi');
const Good = require('good');
const Joi = require('joi');

// Create a server with a host and port
const server = new Hapi.Server();   
server.connection({
    host: 'localhost',
    port: 81
});

server.register([require('inert'), {
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
}], (err) => {
    if (err) throw err;

    server.route({
        method: 'GET',
        path: '/requeteur',
        config: {
            description: 'Retrieve bourses request HTML form',
            handler: {
                file: Path.join(__dirname, 'index.html')
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/requeteur',
        config: {
            description: 'Handles bourse requests',
            validate: {
                payload: {
                    beneficiaire: Joi.string().email().required(),
                    revenuFiscalReference: Joi.number().required().min(0),
                    latfoyer: Joi.number().required(),
                    longfoyer: Joi.number().required(),
                    latecole: Joi.number().required(),
                    longecole: Joi.number().required(),
                    nbPersonnesCharge: Joi.number().min(0).max(100).required(),
                    statut: Joi.string().valid('DEPOSE', 'REFUSE', 'EN_TRAITEMENT', 'EN_PAIEMENT', 'ARCHIVE').default('DEPOSE')
                }
            },
            handler: (request, reply) => {
                console.log(request.payload);
                request.payload['geolocFoyer'] = {
                    lat: request.payload.latfoyer,
                    long: request.payload.longfoyer 
                };
                request.payload['geolocEcole'] = {
                    lat: request.payload.latecole,
                    long: request.payload.longecole
                };

                const post = http.request({
                    host: 'localhost',
                    port: 82,
                    path: '/bourses',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, (result) => {
                    console.log(`STATUS: ${res.statusCode}`);
                    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
                    if (result.statusCode === 201) {
                        reply(201).location(res.headers['Location']);
                    } else {
                        reply(400);
                    }
                });
                post.on('error', (e) => {
                    console.error(`problem with request: ${e.message}`);
                });
                post.write(JSON.stringify(request.payload));
                post.end();
            }
        }
    });

    server.start((err) => {
        if (err) throw err;
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
