'use strict';

const path = require('path');
const log4js = require('log4js');

const cfg = process.env.NODE_ENV === 'production' ? require('./production.json') : require('./development.json');


log4js.configure({
    appenders: {
        app: { type: 'dateFile', filename: path.join(cfg.log_dir, 'md.log'), pattern: '.yyyy-MM-dd', daysToKeep: 7 },
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['app', 'console'], level: 'debug' }
    }
});

module.exports = cfg;