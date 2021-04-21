# API Test Engine - Static Conformance Test Kit


Test the conformance of your swagger definition against the official swagger, defined by the official standards body.

## Table of Contents

- [API Test Engine - Static Conformance Test Kit](#api-test-engine---static-conformance-test-kit)
  - [Table of Contents](#table-of-contents)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
      - [Install locally - NodeJS](#install-locally---nodejs)
      - [Install virtually - Docker](#install-virtually---docker)
    - [API Catalogues](#api-catalogues)
        - [TMForum openAPI](#tmforum-openapi)
    - [Usage](#usage)
      - [Use locally - NodeJS](#use-locally---nodejs)
        - [CLI file comparison - NodeJS](#cli-file-comparison---nodejs)
        - [Server mode - NodeJS](#server-mode---nodejs)
      - [Use virtually - Docker container](#use-virtually---docker-container)
        - [CLI file comparison - Docker](#cli-file-comparison---docker)
        - [Server mode - Docker](#server-mode---docker)
    - [Server mode endpoints](#server-mode-endpoints)
      - [/health](#health)
        - [/health - Example request](#health---example-request)
        - [/health - Expected response](#health---expected-response)
      - [/checkFile](#checkfile)
        - [/checkFile - Example Request](#checkfile---example-request)
        - [/checkFile - Expected response](#checkfile---expected-response)
  - [Running the tests](#running-the-tests)
    - [Unit tests & end to end tests](#unit-tests--end-to-end-tests)
    - [Coding styles](#coding-styles)
    - [Postman Regression Test Suite](#postman-regression-test-suite)
    - [Running the Basic Regression Suite via CLI using Newman](#running-the-basic-regression-suite-via-cli-using-newman)
    - [Code Coverage](#code-coverage)
  - [Rules](#rules)
    - [Examples](#examples)
    - [SCTK Rule List](#sctk-rule-list)
    - [Adding a new rule](#adding-a-new-rule)
  - [Extensions mechanism and GitHub access token](#extensions-mechanism-and-github-access-token)
  - [Note](#note)
  - [Built with](#built-with)
  - [Contributing](#contributing)
  - [Code style](#code-style)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [Licence](#licence)
  - [Acknowledgements](#acknowledgements)

## Getting started

### Prerequisites

Clone the GitHub repository

```shell
git clone <url>
```

Open the project directory

```shell
cd VFGroup-APITestEngine-StaticCTK/
```

#### Install locally - NodeJS

Ensure [NodeJS](https://nodejs.org/en/) is installed locally.

Once NodeJS is installed, install the project modules and dependencies

```shell
npm i
```

#### Install virtually - Docker

Ensure [Docker](https://www.docker.com/get-started) is installed locally.

Build the Docker image

```shell
docker build . -t vfgroup-apitestengine-staticctk
```


### API Catalogues

  The SCTK is making use of the official API definitions from different standardisation bodies. 
  Currently the following API definitions are supported by the SCTK:
  - [TMForum openAPI](https://github.com/tmforum-apis)

  For the TMForum openAPI a set of extension definitions are created and governent by the API Guild, further described [here](#extensions-mechanism-and-github-access-token).

  Each set of API definitions are grouped in catalogues definitions which can be found under 
  ```/configuration/catalogues/```

  Each catalogue definition includes the following key attributes:
  - Name - the name of the API Catalogue (e.g. TMF)
  - NameRegexp - Regexp expression that can be used by the SCTK on the *.swagger.json file in order to determine the appropriate catalogue (e.g. TMF)
  - KeyRegexp - Regexp expression that can be used by the SCTK on the *.swagger.json file in order to identify the API unique key (both catalogues TMF & CSM provide this mechanism)
  - url - the homepage of the catalogue; usually is the a version controlled repo homepage
  - items - array of the API definitions 

  For complete description of the catalogue specification see the catalogue schema definition which can be found at ```/configuration/Catalogue.schema.json```

##### TMForum openAPI
  The official TMForum homepage can be found [here](https://www.tmforum.org/open-apis/)

  The official TMForum openAPI repository used by the SCTK can be found [here](https://github.com/tmforum-apis).


### Usage

Currently the tool can be run [locally] using [NodeJS](https://nodejs.org/en/).

#### Use locally - NodeJS

Assuming you have already the project locally.

##### CLI file comparison - NodeJS

Run the CLI file comparison command, using 2 parameters: location of the official swagger followed by the location of the edited swagger file

```shell
node src/index.js -c location/of/official/swagger.json location/of/edited/swagger.json
```

Here's an example

![SCTK local cli demo](GitHub/samples/SCTK_local_cli_demo.gif)

The output shows a list of the different rule changes, the green changes are compliant, red changes are non-compliant.

There is also a more detailed response file that is created within the results folder. The location is printed at the end. e.g. `results/25-10-2019_TMF646-Appointment-3.0.4.swagger.json_sctk-result.json`


##### Server mode - NodeJS

Server mode will create a webserver with endpoints to validate files via REST requests.

Run the tool using server mode

```shell
npm start
```

The server should start like this

![SCTK local server demo](GitHub/samples/SCTK_local_server_demo.gif)

The server will start and on port 3000 by default.


#### Use virtually - Docker container

We will use the Docker image that you have already built.

##### CLI file comparison - Docker

Takes 2 files as input and compares there fundamental swagger properties.

```shell
docker run vfgroup-apitestengine-staticctk node src/index.js -c [Official Swagger] [Modified Swagger]
```

```shell
docker run vfgroup-apitestengine-staticctk node src/index.js -c test/samples/Official-TMF666-AccountManagement-2.1.swagger.json test/samples/TMF666-AccountManagement-2.1.swagger.yaml
```

The docker CLI file comparison should operate like this:

![SCTK local server demo](GitHub/samples/SCTK_dockercli.gif)

##### Server mode - Docker

Provides API endpoints for testing the compliance of a given swagger file. The metadata provided with the file must include the api key, market code. There is also the option to stop the test sending the results form automatically being sent to the Grafana dashboard.

```shell
docker run -p 3000:3000 vfgroup-apitestengine-staticctk node src/index.js -s
```

The server should operate like this:

![SCTK local server demo](GitHub/samples/SCTK_dockerserver.gif)

### Server mode endpoints

#### /health

Health should always respond with 200 OK

##### /health - Example request

- Method: `ANY`
- Endpoint: `/health`

##### /health - Expected response

- Status: 200
- Body: OK

#### /checkFile

Check file will take a swagger file, along with market and an api key and return a status object containing the metadata and compliance results from the test.

##### /checkFile - Example Request

- Method: `POST`
- Endpoint: `/staticComplianceTesting/v1/checkFile`
- Headers: Content-Type: multipart/form-data
- Body:
  - Type: form-data
  - Values:

| Required / Optional | Parameter       | Type       | Example Value                                                                                                                                                              | Default |
| ------------------- | --------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Optional            | `url`           | `Text`     | <https://github.tst/blob/master/samples/Market/TEST/TMF620-ProductCatalogManagement-2.2.0.swagger.json> |
| Required            | `key`           | `Text`     | TMF620                                                                                                                                                                     |
| Required            | `market`        | `Text`     | TEST                                                                                                                                                                       |
| Required            | `swaggerFile`   | **`File`** | `samples/market/TEST/TMF620-ProductCatalogManagement-2.2.0.swagger.json`                                                                                                   |
| Optional            | `sendToGrafana` | `Text`     | no                                                                                                                                                                         | yes     |

##### /checkFile - Expected response

- Status: 200
- Body:

Status object

```JSON
{
  "apiName": "",
  "market": "DE",
  "conformanceDetails": {
      "officialRelease": {},
      "suppliedRelease": {
          "key": "TMF620",
          "title": "TMF620ProductCatalogManagement",
          "version": "1.8",
          "market": "TEST"
      }
  },
  "results": {},
  "compliance": 0,
  "statusMessage": "Unable to find description within the swagger file",
  "sendToGrafana": "no",
  "Timestamp": "2019-10-30T15:17:01.793Z",
  "executionID": "52ccfc20-fb28-11e9-bd14-19254a4bd1a5"
}
```

## Running the tests

Run the projects automated tests

```shell
npm test
```

### Unit tests & end to end tests

Using Jest Testing Framework. These tests run as use cases to the system. Some file unit testing and other functionality testing on components. The Jest tests will also produce a coverage report.

Should look something like this

![npm test results](GitHub/samples/npm_test.png)

### Coding styles

We use eslint to enforce coding standards. An eslint check is run on the whole project with the `npm test` command.

### Postman Regression Test Suite

Integrated into the Jenkins pipeline there is a Basic Regression test suite which runs 8 tests surrounding the validation of variables for a pass, fail and warning sample.

```shell
✓  Status code is 200

✓  Contains market

✓  Contains API Name

✓  Contains key

✓  Contains version

✓  Contains conformance response

✓  Contains compliance status message

✓  Check correct compliance result
```

All tests must pass for the pipeline to build.

### Running the Basic Regression Suite via CLI using Newman

Firstly start the server

```shell
npm start
```

Then you can run the postman tests

```shell
npm run postmanTests
```

### Code Coverage

We use sonarqube for monitoring code coverage


## Rules

There are defined rules implemented within the SCTK to determine the compliancy score outputted from the tool. These rules consist of standard rules and exception rules.

Swagger-Diff defines rules that performs ONE type of diff checking. In the SCTK these rules are separated in 3 groups categorised as smooth, break and info.

### Examples

**Breaking changes:**

- Delete path
- Rename path operationId
- Modify a response item

**Smooth changes:**

- Add a path
- Add response item
- Add/Update descriptions

**Informational changes:**

- Edit a description
- Edit a summary
- Add optional field

**The standard SCTK rule has the following attributes always reported:**

- ruleId - Identifier of the rule, rule friendly name
- Message - Description of the rule, customized for the current situation
- Path - API path where the condition was encountered
- Method - The API Method encountered (GET, POST, etc)
- Param - the parameter. Swagger parameters can have different types (header or query) but they are all parameters.

For example an SCTK exception rule for adding a required header is implemented as shown here:

```shell
{
  "ruleId": "add-required-header",
  "param": "Authorization",
  "exceptionMessage": "[SCTK Rule Exception - #001]"
}
```

As per agreement, this rule will be ignored when the compliance score is computed and the rules will be moved under the "infos' section.

```shell
{
 "ruleId": "add-required-header",
 "message": "[SCTK Rule Exception - as per decision #1];
             /resource (get) -
             Required header Authorization added",
 "path": "/resource",
 "method": "get",
 "param": "Authorization"
 },
```

### SCTK Rule List

This is the full list of rules implemented in the SCTK thusfar:

```shell
  { break: {
   'add-required-object-property': require('./break/add-required-object-property.js'),
   'add-required-param': require('./break/add-required-param.js'),
   'delete-definition': require('./break/delete-definition.js'),
   'delete-method': require('./break/delete-method.js'),
   'delete-operation-id': require('./break/delete-operation-id.js'),
   'delete-path': require('./break/delete-path.js'),
   'delete-produce': require('./break/delete-produce.js'),
   'delete-response': require('./break/delete-response.js'),
   'add-required-header': require('./break/add-required-header.js'),
   'edit-array-items-type': require('./break/edit-array-items-type.js'),
   'edit-object-property-required': require('./break/edit-object-property-required.js'),
   'edit-object-property-type': require('./break/edit-object-property-type.js'),
   'edit-operation-id': require('./break/edit-operation-id.js'),
  }
 smooth: {
   'add-definition': require('./smooth/add-definition.js'),
   'add-description': require('./smooth/add-description.js'),
   'add-optional-header': require('./smooth/add-optional-header.js'),
   'add-method': require('./smooth/add-method.js'),
   'add-optional-object-property': require('./smooth/add-optional-object-property.js'),
   'add-optional-param': require('./smooth/add-optional-param.js'),
   'add-path': require('./smooth/add-path.js'),
   'add-response': require('./smooth/add-response.js'),
   'delete-object-property': require('./smooth/delete-object-property.js'),
   'delete-param': require('./smooth/delete-param.js'),
   'delete-definition': require('./break/delete-definition.js'),
   'delete-method': require('./break/delete-method.js'),
   'delete-operation-id': require('./break/delete-operation-id.js'),
   'delete-path': require('./break/delete-path.js'),
   'delete-produce': require('./break/delete-produce.js'),
   'delete-response': require('./break/delete-response.js'),
   'delete-object-property': require('./smooth/delete-object-property.js'),
   'delete-param': require('./smooth/delete-param.js')
 },
 info: {
   'add-api-proxy-version': require('./smooth/add-api-proxy-version.js'),
   'edit-base-path': require('./break/edit-base-path.js'),
   'edit-host': require('./break/edit-host.js'),
   'add-avf-trace-transanction-id': require('./smooth/add-vf-trace-transanction-id.js'),
   'edit-host': require('./break/edit-host.js'),
   'edit-description': require('./smooth/edit-description.js'),
   'edit-summary': require('./smooth/edit-summary.js')
   'edit-summary': require('./smooth/edit-summary.js'),
   'add-optional-fields-param': require('./smooth/add-optional-fields-param.js'),
   'add-optional-offset-param': require('./smooth/add-optional-offset-param.js'),
   'add-optional-limit-param': require('./smooth/add-optional-limit-param.js'),
   'add-vf-response': require('./smooth/add-vf-response.js'),
   'add-x-example': require('./smooth/add-x-example.js'),
 }
};
```

### Adding a new rule

The logic for rules is defined in several places.

1. Add the new rule in one for the directories under:

 VFGroup-APITestEngine-StaticCTK\src\custom\swagger-diff\lib\rules

2. Add the rule invocation to:

  VFGroup-APITestEngine-StaticCTK\src\custom\swagger-diff\lib\rule\index.js

A rule can be for Swagger v2.0 or for OAS3 or both.
The rule can be a breaking rule, a warning or an info rule. However, the next step actually configures this.

3. The rule should also be added to:

 VFGroup-APITestEngine-StaticCTK\src\custom\swagger-diff\lib\defaultConfig.json and 

 VFGroup-APITestEngine-StaticCTK\src\custom\swagger-diff\lib\defaultConfigOAS3.json

Breaking rules are labelled 3, warnings are 2 and infos 1. The selections in this file will override the location of the rule in the steps above.
```shell
"rules": {
    "add-required-object-property": 3,
    "add-required-param": 3,
    "add-required-header": 3,
    "edit-array-items-type": 3,
    "edit-base-path": 3,
    "edit-object-property-required": 3,
    "edit-object-property-type": 3,
    "edit-operation-id": 3,
    "edit-param-collection-format": 3,
    "edit-param-in": 3,
    "edit-param-required": 3,
    "edit-param-type": 3,
    "edit-response": 3,
    ...
```

4. Breaking and warning rules need added to the compliance logic:

 VFGroup-APITestEngine-StaticCTK\src\helpers\compliance.js

Update functions getFailRules and getWarningRules
```shell
function getFailRules (openapi) {
    ...
}

function getWarningRules (openapi) {
    ...
}
```

5. Exception rules can prevent a rule being included in the final list of non-compliances. The rule you added should be reviewed to ascertain if exceptions are required. The rules are found at:

 VFGroup-APITestEngine-StaticCTK\configuration\exceptionRules.json and 

 VFGroup-APITestEngine-StaticCTK\configuration\exceptionRulesOAS3.json 


```shell
{
    "ruleId": "add-required-header",
    "param": "Authorization",
    "exceptionMessage": "[SCTK Rule Exception - #001]"
  },
  {
    "ruleId": "add-required-header-component-openapi",
    "param": "Authorization",
    "exceptionMessage": "[SCTK Rule Exception - #3001]"
  },
  {
    "ruleId": "add-required-header",
    "param": "Content-Type",
    "exceptionMessage": "[SCTK Rule Exception - #002]"
  },
  ...
```

6. Update the test rulesOAS3.test to add your rule.
If your rule is a break or warning you should include a check in the status message at the end of the relevant test case.
```shell
        expect(response.compliance).toBe(0);
        expect(response.statusMessage).toMatch(/edit-param-required-component-openapi/);
        expect(response.statusMessage).toMatch(/edit-param-type-openapi/);
        expect(response.statusMessage).toMatch(/edit-param-type-component-openapi/);
        ...
```


## Extensions mechanism and GitHub access token

Extension mechanism is making use of the Vodafone Github Enterprise as such not public available.


## Note

:exclamation: Take note that when developing a project using the tool with branches, there is a character limitation of **20** characters for the branch name, if the name of the branch exceeds this character limitation then the build is likely to fail.

Branch name must consist of lower case alphanumeric characters or '-', start with an alphabetic character, and end with an alphanumeric character (e.g. 'my-name', or 'abc-123', regex used for validation is '[a-z]([-a-z0-9]*[a-z0-9])?')

## Built with

- [NodeJS](https://nodejs.org/en/) - The JavaScript runtime used.
- [Docker](https://www.docker.com/get-started) - The container solution.
- [Express](https://expressjs.com/) - The web framework for NodeJS.
- [Jest](https://jestjs.io/) - The JavaScript Testing Framework
- [swagger-parser](https://www.npmjs.com/package/swagger-parser) - Used to validate swagger objects
- [swagger-diff](https://www.npmjs.com/package/swagger-diff) - Used to compare 2 swagger files
- [jsonDiffPatch](https://www.npmjs.com/package/jsondiffpatch) - Used to compare the in-depth json differences
- [SonarQube](https://www.sonarqube.org/) - Used for analyzing code coverage

## Contributing

Test code before committing to master with npm test, and npx run newman

## Code style

[![code style: prettier-standard](https://camo.githubusercontent.com/87e31b72cd2215215ce00d6d4d72a1aa4e5a563d/68747470733a2f2f692e696d6775722e636f6d2f4636324751556b2e706e67)](https://github.com/sheerun/prettier-standard)

## Versioning

We are now in live Beta.

We ensure best practices where we can, as well as matching versions to releases.

v0.1.2 is our standard format.

Please update the `release` within the `configuration/config.json` before you create a new release within GitHub.
This release is in the result from the API Validation and hence in Grafana.

## Authors


## Licence

MIT License. Check the Licence file.

## Acknowledgements

- Working closely with [TM Forum](https://www.tmforum.org/). Their official swagger repository is found [here](https://github.com/tmforum-apis/)
- I would like to thanks the members of **Vodafone Consumer Products & Services** for all their hard work planning and assisting in making this project. All of your hard effort is much appreciated.
- Thanks to everyone in **Vodafone Technology Strategy & Architecture** for the support and enthusiasm to help bring this tool and project to life.
