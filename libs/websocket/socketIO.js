module.exports = function (io) {
    var app = require('express');
    var router = app.Router();
    var libs = process.cwd() + '/libs/';
    //модуль для логинга ошибок
    var log = require(libs + 'log/log')(module);

    var event = require('../event');
    var currentClients = {};



    io.on('connection', function (socket) {
        log.info("A user connected with id: " + socket.id);
        currentClients[socket.id] = socket.handshake.query.id;

        socket.on('disconnect', function () {
            log.warn('A user disconnected');

        });

        event.on('newMessage_' + currentClients[socket.id], function() {
            socket.emit('newMessage', 'wow');
        });
        //event.on('newMessage_' + currentClients[socket.id], function() {
        //   socket.emit('newMessage', 'wow');
        //});

        socket.on('message', function (msg) {
            log.info('A user send a message: ' + msg);
        });

        socket.on('error', function () {
            log.error('An error occurred');
        });

    });

    return router;
};
