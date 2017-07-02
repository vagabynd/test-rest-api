var nconf = require('nconf');

nconf.add('global', { type: 'file', file: process.cwd() + '/config.json' });
nconf.add('secret', { type: 'file', file: process.cwd() + '/config_secret.json' });

module.exports = nconf;