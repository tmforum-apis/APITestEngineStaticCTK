const cliController = require('../src/controllers/CLIController.js');
const path = require('path');

describe('Test Rules', () => {

    test('add rules OAS3', async () => {
        let lfs = path.resolve(__dirname, '../test/samples/oas3/PetStore.swagger.json');
        let rfs = path.resolve(__dirname, '../test/samples/oas3/CopyPetStoreAdd.swagger.json');

        //expect.assertions(2);
        const response = await cliController.performCLIComplianceCheck(lfs, rfs);
        //console.log(response.results.rules.unmatchDiffs);
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'add-method'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'add-description'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'add-object-property-restriction'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'add-optional-header'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'add-optional-param'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'add-path'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'add-required-header'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'add-required-object-property'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'add-required-param'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'add-required-param-component-openapi'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'add-response'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'add-component-object-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'add-deprecated-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'add-content-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'add-example-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'add-examples-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'add-optional-fields-param-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'add-optional-offset-param-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'add-optional-limit-param-openapi'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'add-optional-param-component-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'add-requestbody-openapi'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'add-required-header-component-openapi'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'add-required-param-component-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'add-response-component-openapi'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'add-schema-openapi'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'add-security-openapi'})
        );

        // Check that there are no unmatched diffs
        expect(response.results.rules.unmatchDiffs).toEqual([]);

        // Check compliance to ensure that all breaking and warning rules displayed
        // based on VFGroup-APITestEngine-StaticCTK\src\custom\swagger-diff\lib\defaultConfig.json
        expect(response.compliance).toBe(0);
        expect(response.statusMessage).toMatch(/add-security-openapi/);
        expect(response.statusMessage).toMatch(/add-required-header-component-openapi/);
        expect(response.statusMessage).toMatch(/add-required-param-component-openapi/);
        expect(response.statusMessage).toMatch(/add-schema-openapi/);
        expect(response.statusMessage).toMatch(/add-optional-param-component-openapi/);
        expect(response.statusMessage).toMatch(/add-component-object-openapi/);
    });

    test('delete rules OAS3', async () => {
        let lfs = path.resolve(__dirname, '../test/samples/oas3/PetStore.swagger.json');
        let rfs = path.resolve(__dirname, '../test/samples/oas3/CopyPetStoreDelete.swagger.json');

        //expect.assertions(2);
        const response = await cliController.performCLIComplianceCheck(lfs, rfs);
        //console.log(response.results.rules.unmatchDiffs);
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'delete-method'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'delete-object-property'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'delete-operation-id'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'delete-param'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'delete-path'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'delete-response'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'delete-component-object-openapi'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'delete-method-servers-openapi'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'delete-schema-object-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'delete-response-header-openapi'})
        );

        // Check that there are no unmatched diffs
        expect(response.results.rules.unmatchDiffs).toEqual([]);

        // Check compliance to ensure that all breaking and warning rules displayed
        // based on VFGroup-APITestEngine-StaticCTK\src\custom\swagger-diff\lib\defaultConfig.json
        expect(response.compliance).toBe(1);
        expect(response.statusMessage).toMatch(/delete-component-object-openapi/);
        expect(response.statusMessage).toMatch(/delete-schema-object-openapi/);
    });

    test('edit rules OAS3', async () => {
        let lfs = path.resolve(__dirname, '../test/samples/oas3/PetStore.swagger.json');
        let rfs = path.resolve(__dirname, '../test/samples/oas3/CopyPetStoreEdit.swagger.json');

        //expect.assertions(2);
        const response = await cliController.performCLIComplianceCheck(lfs, rfs);
        //console.log(response.results.rules.unmatchDiffs);
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-array-items-type'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-description'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-object-property-restriction'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-object-property-type'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-operation-id'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-param-in'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-param-required'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-summary'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-title'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-callback-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-deprecated-openapi'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-component-object-openapi'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-method-servers-openapi'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-param-allowEmptyValue-openapi'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-param-required-component-openapi'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-param-type-openapi'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-param-type-component-openapi'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-requestbody-openapi'})
        );
        expect(response.results.rules.errors).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-response-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-security-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-servers-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-x-origin-openapi'})
        );
        expect(response.results.rules.warnings).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-servers-url-openapi'})
        );
        expect(response.results.rules.infos).toContainEqual(
            expect.objectContaining({ ruleId : 'edit-schema-object-openapi'})
        );

        // Check that there are no unmatched diffs
        expect(response.results.rules.unmatchDiffs).toEqual([]);
        //console.log(JSON.stringify(response.results.rules.unmatchDiffs, null,4));

        // Check compliance to ensure that all breaking and warning rules displayed
        // based on VFGroup-APITestEngine-StaticCTK\src\custom\swagger-diff\lib\defaultConfig.json
        expect(response.compliance).toBe(0);
        expect(response.statusMessage).toMatch(/edit-param-required-component-openapi/);
        expect(response.statusMessage).toMatch(/edit-param-type-openapi/);
        expect(response.statusMessage).toMatch(/edit-param-type-component-openapi/);
        expect(response.statusMessage).toMatch(/edit-response-openapi/);
        expect(response.statusMessage).toMatch(/edit-callback-openapi/);
        expect(response.statusMessage).toMatch(/edit-component-object-openapi/);
        expect(response.statusMessage).toMatch(/edit-method-servers-openapi/);
        expect(response.statusMessage).toMatch(/edit-param-allowEmptyValue-openapi/);
        expect(response.statusMessage).toMatch(/edit-requestbody-openapi/);
        expect(response.statusMessage).toMatch(/edit-servers-url-openapi/);
    });
    
});
