'use strict';

const express = require('express');
var app = express();
// const LocalCache = require('./helpers/caching');
const CatalogueConf = require('./helpers/catalogueConf');
const path = require('path');
const config = require(path.join(__dirname, '../configuration', 'config.json'));

// Import middleware
var logger = require('./middleware/logger');

// Import routes
var indexRouter = require('./routes/index');
var healthRouter = require('./routes/health');
var standardRouter = require('./routes/standard');
var apiRouter = require('./routes/api');

// check if the configuration is correct
if (!config.apiListURL) {
  console.error('API List URL is not set in the configuration file!');
  process.exit();
}

if (!config.serverPort) {
  console.error('Port number not configured correctly (config.json - serverPort)!');
  process.exit();
}

// Setup middleware
app.use(logger);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' })); // extended: false,

// Setup routers
app.use('/staticComplianceTesting/v1', apiRouter);
app.use('/', indexRouter);
app.use('/health', healthRouter);
app.use('/*', standardRouter);

console.log('Starting to initialize the local catalogue - Start');

/*let catalogue =*/ new CatalogueConf();

//console.log(catalogue.getCatalogue());
//console.log(catalogue.getExceptionRules());
//console.log(CatalogueConf.staticCatalogue);
//console.log(CatalogueConf.getExceptionRules());

console.log('Starting to initialize the local catalogue - Done');

// - Disable temporary

//let p = LocalCache.initialise();
//Promise.all(new Array(p)).then(function (diffResult) {
// console.log('Server is initialised with the API List');
// start the server and serve requests

//}).catch(function (err) {
//console.log(err);
//  reject(err);
// });

module.exports = app;
