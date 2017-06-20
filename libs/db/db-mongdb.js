var mongoose = require('mongoose');

//папка lib
var libs = process.cwd() + '/libs/';
//модуль для логинга ошибок
var log = require(libs + 'log/log')(module);
//подключаем конфиг файл
var config = require(libs + 'config');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('Connection error:', err.message);
});

db.once('open', function callback () {
    log.info("Connected to DB!");
});

module.exports = mongoose;
