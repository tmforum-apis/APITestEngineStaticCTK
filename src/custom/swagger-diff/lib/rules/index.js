'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
  Generated File
  Do not manually modify, use `npm run build:genRulesIndex` instead.
**/

exports.default = {
  break: {
    'add-required-object-property': require('./break/add-required-object-property.js'),
    'add-required-param': require('./break/add-required-param.js'),
    'add-required-header': require('./break/add-required-header.js'),
    'edit-array-items-type': require('./break/edit-array-items-type.js'),
    'edit-object-property-required': require('./break/edit-object-property-required.js'),
    'edit-object-property-type': require('./break/edit-object-property-type.js'),
    'edit-operation-id': require('./break/edit-operation-id.js'),
    'edit-param-collection-format': require('./break/edit-param-collection-format.js'),
    'edit-param-in': require('./break/edit-param-in.js'),
    'edit-param-required': require('./break/edit-param-required.js'),
    'edit-param-type': require('./break/edit-param-type.js'),
    'edit-response': require('./break/edit-response.js'),
    'add-object-property-restriction': require('./break/add-object-property-restriction.js'),
    'edit-object-property-restriction': require('./break/edit-object-property-restriction.js')
  },
  smooth: {
    'add-definition': require('./smooth/add-definition.js'),
    'add-description': require('./smooth/add-description.js'),
    'add-optional-header': require('./smooth/add-optional-header.js'),
    'add-method': require('./smooth/add-method.js'),
    'add-optional-object-property': require('./smooth/add-optional-object-property.js'),
    'add-optional-param': require('./smooth/add-optional-param.js'),
    'add-path': require('./smooth/add-path.js'),
    'add-response': require('./smooth/add-response.js'),
    'delete-definition': require('./break/delete-definition.js'),
    'delete-method': require('./break/delete-method.js'),
    'delete-operation-id': require('./break/delete-operation-id.js'),
    'delete-path': require('./break/delete-path.js'),
    'delete-produce': require('./break/delete-produce.js'),
    'delete-response': require('./break/delete-response.js'),
    'delete-object-property': require('./smooth/delete-object-property.js'), //Note!: moved to smooth to breaking
    'delete-param': require('./smooth/delete-param.js')
  },
  info: {
    'add-api-proxy-version': require('./smooth/add-api-proxy-version.js'),
    'edit-base-path': require('./break/edit-base-path.js'),
    'add-avf-trace-transanction-id': require('./smooth/add-vf-trace-transanction-id.js'),
    'edit-host': require('./break/edit-host.js'),
    'edit-description': require('./smooth/edit-description.js'),
    'edit-summary': require('./smooth/edit-summary.js'),
    'add-optional-fields-param': require('./smooth/add-optional-fields-param.js'),
    'add-optional-offset-param': require('./smooth/add-optional-offset-param.js'),
    'add-optional-limit-param': require('./smooth/add-optional-limit-param.js'),
    'add-vf-response': require('./smooth/add-vf-response.js'),
    'add-x-example': require('./smooth/add-x-example.js')
  }
};
exports.defaultOAS3 = {
  break: {
    'add-required-object-property': require('./break/add-required-object-property.js'),
    'add-required-param': require('./break/add-required-param.js'),
    'add-required-header': require('./break/add-required-header.js'),
    'edit-array-items-type': require('./break/edit-array-items-type.js'),
    'edit-object-property-required': require('./break/edit-object-property-required.js'),
    'edit-object-property-type': require('./break/edit-object-property-type.js'),
    'edit-operation-id': require('./break/edit-operation-id.js'),
    'edit-param-in': require('./break/edit-param-in.js'),
    'edit-param-required': require('./break/edit-param-required.js'),
    'add-object-property-restriction': require('./break/add-object-property-restriction.js'),
    'edit-object-property-restriction': require('./break/edit-object-property-restriction.js'),
    // Openapi specific rules below
    'add-required-param-component-openapi': require('./oas3/add-required-param-component-openapi.js'),
    'add-required-header-component-openapi': require('./oas3/add-required-header-component-openapi.js'),
    'edit-param-required-component-openapi': require('./oas3/edit-param-required-component-openapi.js'),
    'edit-param-type-openapi': require('./oas3/edit-param-type-openapi.js'),
    'edit-param-type-component-openapi': require('./oas3/edit-param-type-component-openapi.js'),
    'edit-response-openapi': require('./oas3/edit-response-openapi.js')
  },
  smooth: {
    'add-description': require('./smooth/add-description.js'),
    'add-optional-header': require('./smooth/add-optional-header.js'),
    'add-method': require('./smooth/add-method.js'),
    'add-optional-object-property': require('./smooth/add-optional-object-property.js'),
    'add-optional-param': require('./smooth/add-optional-param.js'),
    'add-path': require('./smooth/add-path.js'),
    'add-response': require('./smooth/add-response.js'),
    'delete-definition': require('./break/delete-definition.js'),
    'delete-method': require('./break/delete-method.js'),
    'delete-operation-id': require('./break/delete-operation-id.js'),
    'delete-path': require('./break/delete-path.js'),
    'delete-response': require('./break/delete-response.js'),
    'delete-object-property': require('./smooth/delete-object-property.js'), //Note!: moved to smooth from breaking
    'delete-requestbody-openapi': require('./oas3/delete-requestbody-openapi'),
    'delete-param': require('./smooth/delete-param.js'),
    // Openapi specific rules below
    'add-optional-param-component-openapi': require('./oas3/add-optional-param-component-openapi.js'),
    'add-component-object-openapi': require('./oas3/add-component-object-openapi.js'),
    'add-schema-openapi': require('./oas3/add-schema-openapi.js'),
    'add-security-openapi': require('./oas3/add-security-openapi.js'),
    'delete-component-object-openapi': require('./oas3/delete-component-object-openapi.js'),
    'delete-method-servers-openapi': require('./oas3/delete-method-servers-openapi.js'),
    'delete-schema-object-openapi': require('./oas3/delete-schema-object-openapi.js'),
    'edit-callback-openapi': require('./oas3/edit-callback-openapi.js'),
    'edit-component-object-openapi': require('./oas3/edit-component-object-openapi.js'),
    'edit-method-servers-openapi': require('./oas3/edit-method-servers-openapi.js'),
    'edit-param-allowEmptyValue-openapi': require('./oas3/edit-param-allowEmptyValue-openapi.js'),
    'edit-requestbody-openapi': require('./oas3/edit-requestbody-openapi.js'),
    'edit-servers-url-openapi': require('./oas3/edit-servers-url-openapi.js'),
    'edit-servers-openapi': require('./oas3/edit-servers-openapi.js')
  },
  info: {
    //'add-avf-trace-transanction-id': require('./smooth/add-vf-trace-transanction-id.js'),
    'edit-description': require('./smooth/edit-description.js'),
    'edit-summary': require('./smooth/edit-summary.js'),
    'edit-title': require('./smooth/edit-title.js'),
    //'add-vf-response': require('./smooth/add-vf-response.js'),
    //'add-x-example': require('./smooth/add-x-example.js'),
    // Openapi specific rules below
    'add-content-openapi': require('./oas3/add-content-openapi.js'),
    'add-deprecated-openapi': require('./oas3/add-deprecated-openapi.js'),
    'add-example-openapi': require('./oas3/add-example-openapi.js'),
    'add-examples-openapi': require('./oas3/add-examples-openapi.js'),
    'add-optional-fields-param-openapi': require('./oas3/add-optional-fields-param-openapi.js'),
    'add-optional-offset-param-openapi': require('./oas3/add-optional-offset-param-openapi.js'),
    'add-optional-limit-param-openapi': require('./oas3/add-optional-limit-param-openapi.js'),
    'add-requestbody-openapi': require('./oas3/add-requestbody-openapi'),
    'add-response-component-openapi': require('./oas3/add-response-component-openapi.js'),
    'add-response-content-openapi': require('./oas3/add-response-content-openapi'),
    'add-response-header-openapi': require('./oas3/add-response-header-openapi.js'),
    'delete-callback-openapi': require('./oas3/delete-callback-openapi.js'),
    'delete-response-content-openapi': require('./oas3/delete-response-content-openapi.js'),
    'delete-response-header-openapi': require('./oas3/delete-response-header-openapi.js'),
    'edit-deprecated-openapi': require('./oas3/edit-deprecated-openapi.js'),
    'edit-schema-object-openapi': require('./oas3/edit-schema-object-openapi.js'),
    'edit-security-openapi': require('./oas3/edit-security-openapi.js'),
    'edit-x-origin-openapi': require('./oas3/edit-x-origin-openapi.js')
  }
};
//module.exports = exports['default'];
module.exports = exports;
