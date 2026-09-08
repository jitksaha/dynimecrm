"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@lingui/core");
const _applicationexceptionfilter = require("../application-exception-filter");
const _enrichapplicationmanifestsyncerrorutil = require("../application-manifest/utils/enrich-application-manifest-sync-error.util");
const _applicationexception = require("../application.exception");
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
const _flatentitymapsexception = require("../../../metadata-modules/flat-entity/exceptions/flat-entity-maps.exception");
const OBJECT_UNIVERSAL_IDENTIFIER = 'b1b2c3d4-0003-4000-a000-000000000003';
const manifest = {
    application: {
        displayName: 'Test Application'
    },
    objects: [
        {
            universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            labelSingular: 'Invoice'
        }
    ],
    fields: []
};
const catchAsGraphQLError = (exception)=>{
    const filter = new _applicationexceptionfilter.ApplicationExceptionFilter();
    try {
        filter.catch(exception);
    } catch (graphqlError) {
        return graphqlError;
    }
    throw new Error('ApplicationExceptionFilter did not throw');
};
describe('ApplicationExceptionFilter response error format', ()=>{
    it('should surface an install conflict as APPLICATION_INSTALLATION_FAILED with a human message', ()=>{
        const originalError = new _flatentitymapsexception.FlatEntityMapsException('addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow: flat entity to add already exists (universalIdentifier: b1b2c3d4-0003-4000-a000-000000000003)', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_ALREADY_EXISTS, {
            context: {
                universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
                operation: 'add'
            }
        });
        const enrichedError = (0, _enrichapplicationmanifestsyncerrorutil.enrichApplicationManifestSyncError)({
            error: originalError,
            manifest
        });
        expect(enrichedError.code).toBe(_applicationexception.ApplicationExceptionCode.APPLICATION_INSTALLATION_FAILED);
        const graphqlError = catchAsGraphQLError(enrichedError);
        expect(graphqlError.extensions.code).toBe(_graphqlerrorsutil.ErrorCode.APPLICATION_INSTALLATION_FAILED);
        expect(graphqlError.context).toEqual({
            universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            operation: 'add'
        });
        expect(graphqlError.extensions.context).toBeUndefined();
        expect(JSON.parse(JSON.stringify(graphqlError.toJSON()))).not.toHaveProperty('context');
        expect({
            name: graphqlError.name,
            message: graphqlError.message,
            extensions: {
                code: graphqlError.extensions.code,
                subCode: graphqlError.extensions.subCode,
                userFriendlyMessage: _core.i18n._(graphqlError.extensions.userFriendlyMessage)
            }
        }).toMatchSnapshot();
    });
});

//# sourceMappingURL=application-exception-filter.spec.js.map