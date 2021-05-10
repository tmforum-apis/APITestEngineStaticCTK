'use strict';
// Elastic Search access methods
const helpers = require('../helpers/index');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const config = require(path.join(__dirname, '../../configuration', 'config.json'));
const axios = require('axios');




async function pushLatestMatchingLocalResultToRemote(localMarket, TMFKey, APIVersion, ES_URL, ES_TOKEN, localResultStatusObj, gitHubId) {
    // Add unique uniqueAPIKey field for Elastic
    if(typeof localResultStatusObj === 'object' && localResultStatusObj !== null){
      localResultStatusObj['uniqueAPIKey'] = `${localMarket}-${TMFKey}-${APIVersion}`;
      console.log(`Pushing local result for ${localMarket}, ${TMFKey}-${APIVersion} to remote with unique api key ${localResultStatusObj['uniqueAPIKey']}`);
      if(!localResultStatusObj.gitHubCommitId){
        if(!gitHubId){
        	localResultStatusObj.gitHubCommitId = 'revalidation' +'-' + localResultStatusObj.release;
        } else {
        	localResultStatusObj.gitHubCommitId = gitHubId;
        }
      }
      if(localResultStatusObj.version === 'Unknown'){
        localResultStatusObj.version = APIVersion;
      }
    }
    // push the matching remote results and return the resp.
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': ES_TOKEN
    };

    let dataString = await JSON.stringify(localResultStatusObj);
    let response = await axios.post(ES_URL, 
        dataString ,
        { headers: headers }
    );
    console.log(response.status);
    //console.log(response.data);
    return response;
  }


async function fetchLatestMatchingRemoteResult(localMarket, TMFKey, APIVersion, ES_URL, ES_TOKEN) {
    console.log(`Fetching remote results for ${localMarket}, ${TMFKey}-${APIVersion}`);
    // fetch the matching remote results and return the latest.
    let response = await axios.get(ES_URL, {
        headers: { Authorization: ES_TOKEN },
        data: {
            query: {
                bool: {
                    must: [
                        { match: { market: localMarket } },
                        { match: { key: TMFKey } },
                        { match: { version: APIVersion } },
                        { match: { visible: 'true' } }
                    ]
                }
            },
            sort: [
                { "Timestamp": {order: "desc"} }
            ]
        }
    });
    if (response.data.hits.total.value === 0) {
        throw new Error(`For the given API, ${localMarket} ${TMFKey} ${APIVersion}, 
        no results were found in Elasticsearch`);
    } else if (response.data.hits.total.value === 1) {
        return response.data.hits.hits[0]._source;
    } else {
        const hits = response.data.hits.hits;
        hits.sort((a, b) => new Date(b._source.Timestamp) - new Date(a._source.Timestamp));
        return hits[0]._source;
    }
}

 
/**
* Fetch result from Elasticsearch for API.
* 
* @param {Map} comparisonResults which is a map of validationObjects to convert.
* @param {String} Url for Elastic search
* @returns {Map} updated validationObjects.
*/
exports.addRemoteResults = async function (comparisonResults, url) {
    const ES_TOKEN_ENV = process.env.ES_TOKEN;
    if (!ES_TOKEN_ENV) {
        throw new Error('ES_TOKEN missing');
    }
    const ES_TOKEN = 'Basic ' + ES_TOKEN_ENV;
    let ES_URL = config.elasticSearchUrl;
    if(url){
        var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
        if(!regex.test(url)){
          throw new Error('Url not valid');
        }
        // TODO Make more general purpose than Elastic Search - replace doc in case we are passed the doc url
        ES_URL = url.replace('doc', 'search');
    }

    console.log(chalk.yellowBright('Fetching remote results'));
    let responseMap = new Map();
    for (const [key, value] of comparisonResults.entries()) {
      if(value){
        try {
            const latestResult = await fetchLatestMatchingRemoteResult(
                value.localMarket, value.TMFKey, value.APIVersion, ES_URL, ES_TOKEN);
            value.comparisonDetails.remote.toolVersion = latestResult.release;
            value.comparisonDetails.remote.compliance = latestResult.compliance;
            value.comparisonDetails.remote.statusMessage = latestResult.statusMessage;
            value.comparisonDetails.remote.location = ES_URL;
            // Set API Name on local so that it is the same as the current remote!
            if(value.comparisonDetails.local.statusObject)
              value.comparisonDetails.local.statusObject.apiName = latestResult.apiName;

            if (latestResult.results && latestResult.results.rules) {
                value.comparisonDetails.remote.resultSummary = {
                    errors: latestResult.results.rules.errors,
                    warnings: latestResult.results.rules.warnings,
                    infos: latestResult.results.rules.infos,
                    unmatchDiffs: latestResult.results.rules.unmatchDiffs
                }
            }
            responseMap.set(key, value);
        } catch (e) {
            //throw e;
            console.log('   ' + e.message);
            value.comparisonDetails.remote.processErrorFound.errorMessage = e.message;
            responseMap.set(key, value);
        }
      } else {
        console.error('   Remote result not found');
      }
    }
    return responseMap;
}

/**
* Push result to Elasticsearch .
* 
* @param {Map} comparisonResults which is a map of validationObjects to convert.
* @param {url} for ELasticSearch.
* @returns {integer} result code such as 201
*/
exports.publishElasticResults = async function (comparisonResults, url){
    const ES_TOKEN_ENV = process.env.ES_TOKEN;
    if (!ES_TOKEN_ENV) {
        throw new Error('ES_TOKEN missing');
    }
    const ES_TOKEN = 'Basic ' + ES_TOKEN_ENV;
    let ES_URL = url;

    var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    if(!regex.test(url)){
      throw new Error('Url not valid');
    }

    console.log(chalk.yellowBright('Pushing results'));
    let resp;
    for (const [key, value] of comparisonResults.entries()) {
      if(value){
        try {
            let localStatusObj = value.comparisonDetails.local.statusObject;
	        //console.log(localStatusObj);
            resp = await pushLatestMatchingLocalResultToRemote(
                value.localMarket, value.TMFKey, value.APIVersion, ES_URL, ES_TOKEN, localStatusObj);
        } catch (error) {
            console.log('   ' + error.message);
            throw new Error(error.message);
        }
      } else {
        console.log('   Local result not found ');
      }
    } 
    return resp.status; 
}


/**
* Push result to Elasticsearch .
* 
* @param statusObject representing the result of a comparison.
* @param {url} for ELasticSearch.
* @param {gitHubCommitId} 
* @returns {integer} result code such as 201
*/
exports.publishElasticSearchSingleResult = async function (statusObject, url, gitHubCommitId){
    const ES_TOKEN_ENV = process.env.ES_TOKEN;
    if (!ES_TOKEN_ENV) {
        throw new Error('ES_TOKEN missing');
    }
    const ES_TOKEN = 'Basic ' + ES_TOKEN_ENV;
    let ES_URL = url;

    var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    if(!regex.test(url)){
      throw new Error('Url not valid');
    }
    let resp;
    try {
    	console.log(chalk.yellowBright('Pushing result for '), statusObject.key);
    	resp = await pushLatestMatchingLocalResultToRemote(
                statusObject.market, statusObject.key, statusObject.version, ES_URL, ES_TOKEN, statusObject, gitHubCommitId);
        } catch (error) {
            console.log('   ' + error.message);
            throw error;
        }
    return resp.status; 
}