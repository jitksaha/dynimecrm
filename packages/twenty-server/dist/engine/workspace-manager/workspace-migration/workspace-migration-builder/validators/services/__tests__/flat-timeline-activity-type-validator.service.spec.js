"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _timeline = require("twenty-shared/timeline");
const _types = require("twenty-shared/types");
const _twentystandardapplications = require("../../../../../twenty-standard-application/constants/twenty-standard-applications");
const _flattimelineactivitytypevalidatorservice = require("../flat-timeline-activity-type-validator.service");
const APPLICATION_UNIVERSAL_IDENTIFIER = '11111111-1111-4111-8111-111111111111';
const TYPE_UNIVERSAL_IDENTIFIER = '22222222-2222-4222-8222-222222222222';
const OBJECT_UNIVERSAL_IDENTIFIER = '33333333-3333-4333-8333-333333333333';
const RELATION_UNIVERSAL_IDENTIFIER = '44444444-4444-4444-8444-444444444444';
const HAPPENS_AT_UNIVERSAL_IDENTIFIER = '55555555-5555-4555-8555-555555555555';
const emptyMaps = ()=>({
        byUniversalIdentifier: {}
    });
const buildCreationArgs = (applicationUniversalIdentifier, overrides = {})=>({
        flatEntityToValidate: {
            universalIdentifier: TYPE_UNIVERSAL_IDENTIFIER,
            applicationUniversalIdentifier,
            name: 'recordCreated',
            label: 'was created by',
            action: 'created',
            icon: null,
            frontComponentUniversalIdentifier: null,
            objectUniversalIdentifier: null,
            targetRelationFieldUniversalIdentifier: null,
            triggerFieldUniversalIdentifiers: null,
            happensAtFieldUniversalIdentifier: null,
            replacesTimelineActivityTypeUniversalIdentifier: null,
            isActive: true,
            overrides: null,
            createdAt: '2026-08-22T00:00:00.000Z',
            updatedAt: '2026-08-22T00:00:00.000Z',
            ...overrides
        },
        optimisticFlatEntityMapsAndRelatedFlatEntityMaps: {
            flatTimelineActivityTypeMaps: emptyMaps(),
            flatFrontComponentMaps: emptyMaps(),
            flatObjectMetadataMaps: emptyMaps(),
            flatFieldMetadataMaps: emptyMaps()
        }
    });
describe('FlatTimelineActivityTypeValidatorService', ()=>{
    const service = new _flattimelineactivitytypevalidatorservice.FlatTimelineActivityTypeValidatorService();
    it('rejects a workspace-global emitter declared by an application', ()=>{
        const result = service.validateFlatTimelineActivityTypeCreation(buildCreationArgs(APPLICATION_UNIVERSAL_IDENTIFIER));
        expect(result.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                message: 'An application timeline activity emitter must target one of its objects'
            })
        ]));
    });
    it('keeps platform fallback emitters valid', ()=>{
        const result = service.validateFlatTimelineActivityTypeCreation(buildCreationArgs(_twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier));
        expect(result.errors).toEqual([]);
    });
    it('rejects linked emitters without through routing', ()=>{
        const result = service.validateFlatTimelineActivityTypeCreation(buildCreationArgs(APPLICATION_UNIVERSAL_IDENTIFIER, {
            action: 'linked',
            objectUniversalIdentifier: '33333333-3333-4333-8333-333333333333'
        }));
        expect(result.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                message: 'Linked and unlinked timeline activity emitters require a target relation'
            })
        ]));
    });
    it('allows a standard renderer owned by the standard application', ()=>{
        const result = service.validateFlatTimelineActivityTypeCreation(buildCreationArgs(_twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier, {
            frontComponentUniversalIdentifier: _timeline.STANDARD_TIMELINE_ACTIVITY_RENDERER_UNIVERSAL_IDENTIFIERS.message
        }));
        expect(result.errors).toEqual([]);
    });
    it('accepts a direct many-to-one relation as through routing', ()=>{
        const creationArgs = buildCreationArgs(APPLICATION_UNIVERSAL_IDENTIFIER, {
            action: 'linked',
            objectUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            targetRelationFieldUniversalIdentifier: RELATION_UNIVERSAL_IDENTIFIER
        });
        const validationMaps = creationArgs.optimisticFlatEntityMapsAndRelatedFlatEntityMaps;
        validationMaps.flatObjectMetadataMaps.byUniversalIdentifier[OBJECT_UNIVERSAL_IDENTIFIER] = {
            universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER
        };
        validationMaps.flatFieldMetadataMaps.byUniversalIdentifier[RELATION_UNIVERSAL_IDENTIFIER] = {
            universalIdentifier: RELATION_UNIVERSAL_IDENTIFIER,
            objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            type: _types.FieldMetadataType.MORPH_RELATION,
            universalSettings: {
                relationType: _types.RelationType.MANY_TO_ONE
            }
        };
        const result = service.validateFlatTimelineActivityTypeCreation(creationArgs);
        expect(result.errors).toEqual([]);
    });
    it('accepts a date field on the source object as happensAt field', ()=>{
        const creationArgs = buildCreationArgs(APPLICATION_UNIVERSAL_IDENTIFIER, {
            action: 'linked',
            objectUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            targetRelationFieldUniversalIdentifier: RELATION_UNIVERSAL_IDENTIFIER,
            happensAtFieldUniversalIdentifier: HAPPENS_AT_UNIVERSAL_IDENTIFIER
        });
        const validationMaps = creationArgs.optimisticFlatEntityMapsAndRelatedFlatEntityMaps;
        validationMaps.flatObjectMetadataMaps.byUniversalIdentifier[OBJECT_UNIVERSAL_IDENTIFIER] = {
            universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER
        };
        validationMaps.flatFieldMetadataMaps.byUniversalIdentifier[RELATION_UNIVERSAL_IDENTIFIER] = {
            universalIdentifier: RELATION_UNIVERSAL_IDENTIFIER,
            objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            type: _types.FieldMetadataType.MORPH_RELATION,
            universalSettings: {
                relationType: _types.RelationType.MANY_TO_ONE
            }
        };
        validationMaps.flatFieldMetadataMaps.byUniversalIdentifier[HAPPENS_AT_UNIVERSAL_IDENTIFIER] = {
            universalIdentifier: HAPPENS_AT_UNIVERSAL_IDENTIFIER,
            objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            type: _types.FieldMetadataType.DATE_TIME
        };
        const result = service.validateFlatTimelineActivityTypeCreation(creationArgs);
        expect(result.errors).toEqual([]);
    });
    it('rejects a happensAt field that is not a date field on the source object', ()=>{
        const creationArgs = buildCreationArgs(APPLICATION_UNIVERSAL_IDENTIFIER, {
            action: 'linked',
            objectUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            targetRelationFieldUniversalIdentifier: RELATION_UNIVERSAL_IDENTIFIER,
            happensAtFieldUniversalIdentifier: HAPPENS_AT_UNIVERSAL_IDENTIFIER
        });
        const validationMaps = creationArgs.optimisticFlatEntityMapsAndRelatedFlatEntityMaps;
        validationMaps.flatObjectMetadataMaps.byUniversalIdentifier[OBJECT_UNIVERSAL_IDENTIFIER] = {
            universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER
        };
        validationMaps.flatFieldMetadataMaps.byUniversalIdentifier[RELATION_UNIVERSAL_IDENTIFIER] = {
            universalIdentifier: RELATION_UNIVERSAL_IDENTIFIER,
            objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            type: _types.FieldMetadataType.MORPH_RELATION,
            universalSettings: {
                relationType: _types.RelationType.MANY_TO_ONE
            }
        };
        validationMaps.flatFieldMetadataMaps.byUniversalIdentifier[HAPPENS_AT_UNIVERSAL_IDENTIFIER] = {
            universalIdentifier: HAPPENS_AT_UNIVERSAL_IDENTIFIER,
            objectMetadataUniversalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER,
            type: _types.FieldMetadataType.TEXT
        };
        const result = service.validateFlatTimelineActivityTypeCreation(creationArgs);
        expect(result.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                message: 'Timeline activity type happensAt field must be a date field on the source object of a linked relation event'
            })
        ]));
    });
    it('rejects a happensAt field on an emitter without a linked action', ()=>{
        const creationArgs = buildCreationArgs(_twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier, {
            action: 'created',
            happensAtFieldUniversalIdentifier: HAPPENS_AT_UNIVERSAL_IDENTIFIER
        });
        const result = service.validateFlatTimelineActivityTypeCreation(creationArgs);
        expect(result.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                message: 'Timeline activity type happensAt field must be a date field on the source object of a linked relation event'
            })
        ]));
    });
    it('does not expose standard renderers to installed applications', ()=>{
        const creationArgs = buildCreationArgs(APPLICATION_UNIVERSAL_IDENTIFIER, {
            objectUniversalIdentifier: '33333333-3333-4333-8333-333333333333',
            frontComponentUniversalIdentifier: _timeline.STANDARD_TIMELINE_ACTIVITY_RENDERER_UNIVERSAL_IDENTIFIERS.message
        });
        creationArgs.optimisticFlatEntityMapsAndRelatedFlatEntityMaps.flatFrontComponentMaps.byUniversalIdentifier[_timeline.STANDARD_TIMELINE_ACTIVITY_RENDERER_UNIVERSAL_IDENTIFIERS.message] = {
            universalIdentifier: _timeline.STANDARD_TIMELINE_ACTIVITY_RENDERER_UNIVERSAL_IDENTIFIERS.message,
            applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER
        };
        const result = service.validateFlatTimelineActivityTypeCreation(creationArgs);
        expect(result.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                message: 'Timeline activity type references a front component that does not belong to its application'
            })
        ]));
    });
});

//# sourceMappingURL=flat-timeline-activity-type-validator.service.spec.js.map