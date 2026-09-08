"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _applicationexception = require("../../../application.exception");
const _resolveapplicationreferenceidorthrowutil = require("../resolve-application-reference-id-or-throw.util");
const LOGIC_FUNCTION_ID = 'logic-function-id';
const LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER = 'logic-function-universal-identifier';
const OWNER_APPLICATION_ID = 'owner-application-id';
const OTHER_APPLICATION_ID = 'other-application-id';
const WORKSPACE_ID = 'workspace-id';
const flatEntityMaps = {
    byUniversalIdentifier: {
        [LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER]: {
            id: LOGIC_FUNCTION_ID,
            universalIdentifier: LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
            applicationId: OWNER_APPLICATION_ID,
            workspaceId: WORKSPACE_ID
        }
    }
};
describe('resolveApplicationReferenceIdOrThrow', ()=>{
    it('should return the entity id when the universal identifier resolves', ()=>{
        expect((0, _resolveapplicationreferenceidorthrowutil.resolveApplicationReferenceIdOrThrow)({
            flatEntityMaps,
            universalIdentifier: LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
            referenceLabel: 'uninstall logic function',
            exceptionCode: _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND
        })).toBe(LOGIC_FUNCTION_ID);
    });
    it('should return the entity id when the entity belongs to the owner application', ()=>{
        expect((0, _resolveapplicationreferenceidorthrowutil.resolveApplicationReferenceIdOrThrow)({
            flatEntityMaps,
            universalIdentifier: LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
            referenceLabel: 'uninstall logic function',
            exceptionCode: _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND,
            ownerApplicationId: OWNER_APPLICATION_ID
        })).toBe(LOGIC_FUNCTION_ID);
    });
    it('should throw when the universal identifier is unknown', ()=>{
        expect(()=>(0, _resolveapplicationreferenceidorthrowutil.resolveApplicationReferenceIdOrThrow)({
                flatEntityMaps,
                universalIdentifier: 'unknown-universal-identifier',
                referenceLabel: 'uninstall logic function',
                exceptionCode: _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND
            })).toThrow(_applicationexception.ApplicationException);
    });
    it('should throw when the entity belongs to another application', ()=>{
        expect(()=>(0, _resolveapplicationreferenceidorthrowutil.resolveApplicationReferenceIdOrThrow)({
                flatEntityMaps,
                universalIdentifier: LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
                referenceLabel: 'uninstall logic function',
                exceptionCode: _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND,
                ownerApplicationId: OTHER_APPLICATION_ID
            })).toThrow(`Failed to resolve uninstall logic function for universalIdentifier ${LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER}`);
    });
});

//# sourceMappingURL=resolve-application-reference-id-or-throw.util.spec.js.map