var mongoose = require('mongoose');
var MongoDBClient = require("../services/MongoDBClient");
// var schema = require('./schema');
var models = {};

MongoDBClient.getInstance(function(err, client) {
  if (err) {
    console.log("failed to connect to MongoDB, model initialization failed");
  } else {
    console.log("connected to MongoDB, model initialization succeeded");
  }
});

module.exports = models;
