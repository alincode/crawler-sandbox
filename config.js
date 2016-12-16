let config = {};
let appName = process.env.APP_NAME || 'app';

config.mongodb = {};
config.mongodb.dburl = 'mongodb://localhost:27018/' + appName;
module.exports = config;
