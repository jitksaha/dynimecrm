"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _enrichapplicationmanifestsyncerrorutil = require("../enrich-application-manifest-sync-error.util");
const _applicationexception = require("../../../application.exception");
const _flatentitymapsexception = require("../../../../../metadata-modules/flat-entity/exceptions/flat-entity-maps.exception");
const OBJECT_UNIVERSAL_IDENTIFIER = 'object-universal-identifier';
const FIELD_UNIVERSAL_IDENTIFIER = 'field-universal-identifier';
const NESTED_FIELD_UNIVERSAL_IDENTIFIER = 'nested-field-universal-identifier';
const ROLE_UNIVERSAL_IDENTIFIER = 'role-universal-identifier';
const VIEW_FIELD_UNIVERSAL_IDENTIFIER = 'view-field-universal-identifier';
const manifest = {
    application: {
        displayName: 'Stripe'
    },
    objects: [
        {
            universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            labelSingular: 'Invoice',
            fields: [
                {
                    universalIdentifier: NESTED_FIELD_UNIVERSAL_IDENTIFIER,
                    label: 'Due Date'
                }
            ]
        }
    ],
    fields: [
        {
            universalIdentifier: FIELD_UNIVERSAL_IDENTIFIER,
            label: 'Amount'
        }
    ],
    roles: [
        {
            universalIdentifier: ROLE_UNIVERSAL_IDENTIFIER,
            label: 'Support Agent'
        }
    ],
    viewFields: [
        {
            universalIdentifier: VIEW_FIELD_UNIVERSAL_IDENTIFIER
        }
    ]
};
describe('enrichApplicationManifestSyncError', ()=>{
    it('should resolve the offending object and produce an installation exception', ()=>{
        const error = new _flatentitymapsexception.FlatEntityMapsException('addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow: flat entity to add already exists', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_ALREADY_EXISTS, {
            context: {
                universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
                operation: 'add'
            }
        });
        const enriched = (0, _enrichapplicationmanifestsyncerrorutil.enrichApplicationManifestSyncError)({
            error,
            manifest
        });
        expect(enriched).toBeInstanceOf(_applicationexception.ApplicationException);
        expect(enriched.code).toBe(_applicationexception.ApplicationExceptionCode.APPLICATION_INSTALLATION_FAILED);
        expect(enriched.message).toContain('Stripe');
        expect(enriched.message).toContain('Invoice');
        expect(enriched.message).toContain('flat entity to add already exists');
        expect(enriched.context).toEqual({
            universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            operation: 'add'
        });
    });
    it('should resolve the offending field by universalIdentifier', ()=>{
        const error = new _flatentitymapsexception.FlatEntityMapsException('entity malformed', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_MALFORMED, {
            context: {
                universalIdentifier: FIELD_UNIVERSAL_IDENTIFIER
            }
        });
        const enriched = (0, _enrichapplicationmanifestsyncerrorutil.enrichApplicationManifestSyncError)({
            error,
            manifest
        });
        expect(enriched.message).toContain('Amount');
    });
    it('should resolve a field nested in an object manifest by universalIdentifier', ()=>{
        const error = new _flatentitymapsexception.FlatEntityMapsException('flat entity to add already exists', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_ALREADY_EXISTS, {
            context: {
                universalIdentifier: NESTED_FIELD_UNIVERSAL_IDENTIFIER
            }
        });
        const enriched = (0, _enrichapplicationmanifestsyncerrorutil.enrichApplicationManifestSyncError)({
            error,
            manifest
        });
        expect(enriched.message).toContain('field');
        expect(enriched.message).toContain('Due Date');
    });
    it('should resolve a labeled non-object/field kind (role) by universalIdentifier', ()=>{
        const error = new _flatentitymapsexception.FlatEntityMapsException('flat entity to add already exists', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_ALREADY_EXISTS, {
            context: {
                universalIdentifier: ROLE_UNIVERSAL_IDENTIFIER
            }
        });
        const enriched = (0, _enrichapplicationmanifestsyncerrorutil.enrichApplicationManifestSyncError)({
            error,
            manifest
        });
        expect(enriched.message).toContain('role');
        expect(enriched.message).toContain('Support Agent');
    });
    it('should fall back to the entity kind when the resolved entity has no label', ()=>{
        const error = new _flatentitymapsexception.FlatEntityMapsException('flat entity to add already exists', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_ALREADY_EXISTS, {
            context: {
                universalIdentifier: VIEW_FIELD_UNIVERSAL_IDENTIFIER
            }
        });
        const enriched = (0, _enrichapplicationmanifestsyncerrorutil.enrichApplicationManifestSyncError)({
            error,
            manifest
        });
        expect(enriched.message).toContain('view field');
        expect(enriched.message).not.toContain('undefined');
    });
    it('should still enrich when the identifier is not in the manifest', ()=>{
        const error = new _flatentitymapsexception.FlatEntityMapsException('entity not found', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND, {
            context: {
                universalIdentifier: 'unknown-identifier'
            }
        });
        const enriched = (0, _enrichapplicationmanifestsyncerrorutil.enrichApplicationManifestSyncError)({
            error,
            manifest
        });
        expect(enriched).toBeInstanceOf(_applicationexception.ApplicationException);
        expect(enriched.code).toBe(_applicationexception.ApplicationExceptionCode.APPLICATION_INSTALLATION_FAILED);
        expect(enriched.message).toContain('Stripe');
    });
    it('should extract context forwarded through a wrapper exception', ()=>{
        const wrapperError = {
            message: 'wrapped failure',
            context: {
                universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER
            }
        };
        const enriched = (0, _enrichapplicationmanifestsyncerrorutil.enrichApplicationManifestSyncError)({
            error: wrapperError,
            manifest
        });
        expect(enriched).toBeInstanceOf(_applicationexception.ApplicationException);
        expect(enriched.message).toContain('Invoice');
    });
    it('should leave non flat-entity errors untouched', ()=>{
        const error = new Error('some unrelated failure');
        const enriched = (0, _enrichapplicationmanifestsyncerrorutil.enrichApplicationManifestSyncError)({
            error,
            manifest
        });
        expect(enriched).toBe(error);
    });
});

//# sourceMappingURL=enrich-application-manifest-sync-error.util.spec.js.map