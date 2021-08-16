#! /usr/bin/env node

var cmdObj = require('./parseCommandLine.js');
var compareSpecs = require('./helpers/compareSpecs.js');
// var ComplianceCheck = require('./helpers/complianceCheck');
// var appServer = require('./receiver.js');
var cmdArgs = cmdObj.parseCommandLine();
var CliController = require('./controllers/CLIController');
const CatalogueConf = require('./helpers/catalogueConf');

console.log('--------------------');

// Default the output to JSON
if(!cmdArgs['output']){
  cmdArgs['output']='JSON'
}
// generic print console help
if (cmdArgs == null) {
  cmdObj.printHelp();
} else if ('help' in cmdArgs) {
  cmdObj.printHelp();
} else if ('serverMode' in cmdArgs) {
  require('./server');
} else if ('validateSwagger' in cmdArgs) {
  compareSpecs.validate(cmdArgs['validateSwagger']);
} else if ('compare' in cmdArgs) {
  CliController.performCLIComplianceCheck(cmdArgs['compare'][0], cmdArgs['compare'][1], undefined, cmdArgs['output']).catch(error => {
    console.log('Could not perform CLI Compliance check');
    console.log();
    console.log('Logged Error:');
    console.log(error);
  });
} else if ('compareAPIKey' in cmdArgs) {
  CliController.performCLIComplianceCheckWithAPI(cmdArgs['compareAPIKey'][0], cmdArgs['compareAPIKey'][1], cmdArgs['compareAPIKey'][2], 
          undefined, cmdArgs['output']).catch(error => {
    console.log('Could not perform CLI Compliance check against API key');
    console.log();
    console.log('Logged Error:');
    console.log(error);
  });
} else {
  cmdObj.printHelp();
}
