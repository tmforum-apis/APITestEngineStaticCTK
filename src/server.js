console.time('Time taken');
var app = require('./app');
const path = require('path');
var config = require(path.join(__dirname, '../configuration', 'config.json'));
const chalk = require('chalk');

// create server of app
var server = app.listen(config.serverPort);
console.timeEnd('Time taken');

console.log(`Server is listening on ${config.serverPort}`);

// Token variable check
if (!Object.prototype.hasOwnProperty.call(process.env, 'GITHUB_TOKEN'))
  console.log(
    chalk.yellow(
      'WARNING: GITHUB_TOKEN environment variable is not available, SCTK will not be able to load the extensions from the Github Enterprise'
    )
  );
else console.log(chalk.green('GITHUB_TOKEN environment variable detected'));

module.exports = server;
