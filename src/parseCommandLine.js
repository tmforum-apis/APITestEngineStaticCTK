const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const optionDefinitions = [
  { name: 'help', alias: 'h', type: module.exports.printHelp },
  { name: 'validateSwagger', alias: 'v', type: String, multiple: false },
  { name: 'compare', alias: 'c', type: String, multiple: true },
  { name: 'compareAPIKey', alias: 'k', type: String, multiple: true },
  { name: 'serverMode', alias: 's', type: String, multiple: false },
  { name: 'market', alias: 'm', type: String, multiple: false},
  { name: 'script', alias: 'S', type: String, multiple: false}, // Used to indicate code run from docker
  { name: 'gitHubBranch', alias: 'b', type: String, multiple: false}, // Set to name of branch
  { name: 'urlES', alias: 'u', type: String, multiple: false}, // Elastic Search url
  { name: 'output', alias: 'o', type: String, multiple: false} // Enable file output - defaults to a json file
];

module.exports = {
  parseCommandLine: function () {
    try {
      return commandLineArgs(optionDefinitions);
    } catch (e) {
      console.error(e.message);
    }
    return null;
  },

  printHelp: function () {
    const sections = [
      {
        header: 'TestEngine - Static ',
        content: 'Conformance [italic]validations (swagger, TMF compliance)'
      },
      {
        header: 'Synopsis',
        content: '$ app <options>'
      },
      {
        header: 'Command List',
        content: [
          { name: 'help', summary: '-h Display help information ' },
          {
            name: 'validateSwagger',
            summary:
              '-v <path to Swagger VBS> Performs a validation of the Swagger file against the swagger/openAPI 2.0' +
              ' Example: -v "C:\\Docs\\CustomerInteraction\\REST\\VBS\\Customer\\CustomerInteraction\\V2\\CustomerInteractionVBS.swagger"'
          },
          {
            name: 'compare',
            summary:
              '-c <Left side swagger file> <right side swagger file>' + ' -o <DISABLE|JSON|MD|ASCIIDOC|ALL - defaults to generating a JSON result file> ' +
              ' Example: -c leftSwagger.swagger.json rightSwagger.swagger.json or /n' +
              ' -c test/samples/Official-TMF666-AccountManagement-2.1.swagger.json test/samples/TMF666-AccountManagement-2.1.passing.swagger.json'
          },
          {
            name: 'compare API Key',
            summary:
              '-k <API Key> <api version number> <right side swagger file>' + ' -o <DISABLE|JSON|MD|ASCIIDOC|ALL - defaults to generating JSON> ' +
              ' Example: -k TMF622 4.0.0 test/samples/TMF622-ProductOrderingManagement-4.0.0.failing.swagger.json'
          },
          {
            name: 'serverMode',
            summary: '-s' + ' Example: -s 3000 or npm start' 
          }
        ]
      }
    ];

    const usage = commandLineUsage(sections);
    console.log(usage);
  }
};
