'use strict';

/** Compliance values
 * 0 - Fail
 * 1 - Warning
 * 2 - Pass
 */
const FAIL = 0;
const WARNING = 1;
const PASS = 2;
const MAXLENGTH = 300;


function displayRuleList(ruleList, type, emoj){
	let title = '==  ' + type + '\n' + '\n' ;
	let header = '[cols="2, 6, 3, 2"]' + '\n'
	header += '|===\n| ruleId | message  | path  |  property ' + '\n'
	let rows = '\n';
	for(const rule of ruleList){
		let msg ='';
		if(rule.message){
			msg = rule.message.substring(0, MAXLENGTH).replace(/\n/g, '   '); // Limit length and replace CRs
		}
		rows += '| ' +  (emoj||'') + ' ' + rule.ruleId + ' \n|' + msg + ' \n|';
		if(rule.descriptionPath){
			rows +=  rule.descriptionPath.substring(0, MAXLENGTH).replace(/\n/g, '   ');
		} else {
			if(rule.path){
				rows +=  rule.path.substring(0, MAXLENGTH).replace(/\n/g, '   ');
			} else {
				rows += ' ';
			}
		}
		if(rule.property){
			rows += ' \n|' + rule.property +  '\n';
		} else if(rule.param){
			rows += ' \n|' + rule.param +  '\n';
		} else if(rule.componentId){
			rows += ' \n|' + rule.componentId +  '\n';
		} else if(rule.method){
			rows += ' \n|' + rule.method +  '\n';
		} else {
			rows +=  '\n|\n';
		}
	}
	return title + header + rows + '|===\n';
}



function displayConformance(details){
	if(!details){
		return '';
	}
	let result = '==  Conformance Details' + '\n';
	if(details.officialRelease){
		result += '\t' + 'Official Release:' + '\n';
		result += '\t\t' + 'url: ' + (details.officialRelease.url || '') + '\n';
		result += '\t\t' + 'key: ' + (details.officialRelease.key || '') + '\n';
		result += '\t\t' + 'title: ' + (details.officialRelease.title || '') + '\n';
		result += '\t\t' + 'version: ' + (details.officialRelease.version || '') + '\n';
		result += '\t\t' + 'market: ' + (details.officialRelease.market || '') + '\n';
	}
	result += '\n';
	if(details.suppliedRelease){
		result += '\t' + 'Supplied Release:' + '\n';
		result += '\t\t' + 'url: ' + (details.suppliedRelease.url || '') + '\n';
		result += '\t\t' + 'key: ' + (details.suppliedRelease.key || '') + '\n';
		result += '\t\t' + 'title: ' + (details.suppliedRelease.title || '') + '\n';
		result += '\t\t' + 'version: ' + (details.suppliedRelease.version || '') + '\n';
		result += '\t\t' + 'market: ' + (details.suppliedRelease.market || '') + '\n';
	}
	result += '\n'  + '\n';
	return result;
}

function displayStatusMsg(status){
	if(status.startsWith('[')){ // Error message because of invalid file
		return 'The compliance test failed validation. \n\n\t' + (status.replace(/\n/g, '').replace(/   /g, '\n\t')) + '\n\n';
	}
	let result = status.split(';').join('\n\n');
	result = result.split(':').join(':\n');
	result = result.split('[').join('\n\t[');
	return result + '\n\n';
}

function displayTitle(compliance){
	let result = '';
	switch(compliance){
		case FAIL:
			result ='= API  Compliance Results - *Issues found*' +'\n' + '\n';
			break;
		case WARNING:
			result ='= API  Compliance Results - *Warnings found*' +'\n' + '\n';
			break;
		case PASS:
			result ='= API  Compliance Results - *No issues*' +'\n' + '\n';
			break;
		default:
			result ='= API  Compliance Results' +'\n' + '\n';
	}
	return result;
}


/**
* Build the mark down for a dashboard
* 
* @param {object} jsonObj 
*/
exports.generate= function (jsonObj){
    //Create a Mark Down Table element dasboard.
	//console.log(jsonObj.rules);
	let title = displayTitle(jsonObj.compliance);

	let infoText = '';
	if(jsonObj.release){
		infoText += '\tTool version: ' + jsonObj.release + '\n';
		infoText += '\tTimestamp: ' + jsonObj.Timestamp + '\n';
		infoText += '\tCompliance: ' + jsonObj.compliance + '  (0 - COMPATIBILITY ISSUES; 1 - WARNING; 2 - PASS) \n \n';
	} 
	let statusMessage = displayStatusMsg(jsonObj.statusMessage);
	let errors = '',
		warnings = '',
		info = '';
	let conformanceDetails = displayConformance(jsonObj.conformanceDetails);
	if(jsonObj.hasOwnProperty('results') && jsonObj.results.hasOwnProperty('rules')){
		let rules = jsonObj.results.rules;
		if(rules.hasOwnProperty('errors') && rules.errors.length > 0){
			errors = displayRuleList(rules.errors, 'Rules which caused COMPATIBILITY issues ') + '\n';
		}
		if(rules.hasOwnProperty('warnings') && rules.warnings.length > 0){
			warnings = displayRuleList(rules.warnings, 'Rules which caused WARNINGs ') + '\n';
		}
		if(rules.hasOwnProperty('infos') && rules.infos.length > 0){
			info = displayRuleList(rules.infos, 'Informational rules') + '\n';
		}
	}
	else info = ' No errors or warnings to display' + '\n' + '\n'; 
	return title + infoText + statusMessage + conformanceDetails + errors + warnings + info;
}