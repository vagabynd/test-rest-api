var express = require('express');
var router = express.Router();
//var app = require(process.cwd() + '/app');

//папка lib
var libs = process.cwd() + '/libs/';
//модуль для логинга ошибок
var log = require(libs + 'log/log')(module);


var connections = {};
var connectionIDCounter = 0;

router.ws('/', function(ws, req) {
    var connection = ws;
    connection.id = connectionIDCounter ++;
    connections[connection.id] = connection;

    log.info('Peer '+ req.headers.origin + ' Connection ID ' + connection.id + ' accepted.');

    connection.on('message', function(msg) {
        log.info('Client send: ' + msg);
        connection.send("hi! your message was: " + msg);
    });

    connection.on('close', function(msg) {
        log.debug('Peer ' + connection.remoteAddress + ' disconnected. ' +
            "Connection ID: " + connection.id);
        delete connections[connection.id];
    });

    connection.on('error', function(msg) {
        log.error('Error occurred: ' + msg);
    });
});
module.exports = {
    'router': router,
    'connections': connections
};