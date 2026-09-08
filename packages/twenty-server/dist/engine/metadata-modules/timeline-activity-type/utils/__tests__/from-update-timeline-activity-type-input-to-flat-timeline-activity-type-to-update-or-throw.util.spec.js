"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _createemptyflatentitymapsconstant = require("../../../flat-entity/constant/create-empty-flat-entity-maps.constant");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _fromflattimelineactivitytypetotimelineactivitytypedtoutil = require("../from-flat-timeline-activity-type-to-timeline-activity-type-dto.util");
const _fromupdatetimelineactivitytypeinputtoflattimelineactivitytypetoupdateorthrowutil = require("../from-update-timeline-activity-type-input-to-flat-timeline-activity-type-to-update-or-throw.util");
const APPLICATION_UNIVERSAL_IDENTIFIER = '00000000-0000-4000-8000-000000000001';
const WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER = '00000000-0000-4000-8000-000000000002';
const timelineActivityType = {
    id: '00000000-0000-4000-8000-000000000003',
    universalIdentifier: '00000000-0000-4000-8000-000000000004',
    workspaceId: '00000000-0000-4000-8000-000000000005',
    applicationId: '00000000-0000-4000-8000-000000000006',
    applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
    name: 'record.created',
    label: 'was created by',
    action: 'created',
    icon: 'IconPlus',
    frontComponentUniversalIdentifier: null,
    objectUniversalIdentifier: null,
    targetRelationFieldUniversalIdentifier: null,
    triggerFieldUniversalIdentifiers: null,
    happensAtFieldUniversalIdentifier: null,
    replacesTimelineActivityTypeUniversalIdentifier: null,
    isActive: true,
    overrides: null,
    createdAt: '2026-08-22T00:00:00.000Z',
    updatedAt: '2026-08-22T00:00:00.000Z'
};
const flatTimelineActivityTypeMaps = (0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
    flatEntity: timelineActivityType,
    flatEntityMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
});
describe('fromUpdateTimelineActivityTypeInputToFlatTimelineActivityTypeToUpdateOrThrow', ()=>{
    it('stores presentation changes as workspace overrides and mutes the type', ()=>{
        const result = (0, _fromupdatetimelineactivitytypeinputtoflattimelineactivitytypetoupdateorthrowutil.fromUpdateTimelineActivityTypeInputToFlatTimelineActivityTypeToUpdateOrThrow)({
            flatTimelineActivityTypeMaps,
            updateTimelineActivityTypeInput: {
                id: timelineActivityType.id,
                label: 'was added by',
                icon: 'IconSparkles',
                isActive: false
            },
            callerApplicationUniversalIdentifier: WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
            workspaceCustomApplicationUniversalIdentifier: WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
        });
        expect(result).toMatchObject({
            label: 'was created by',
            icon: 'IconPlus',
            isActive: false,
            overrides: {
                label: 'was added by',
                icon: 'IconSparkles'
            }
        });
        expect((0, _fromflattimelineactivitytypetotimelineactivitytypedtoutil.fromFlatTimelineActivityTypeToTimelineActivityTypeDto)(result)).toMatchObject({
            label: 'was added by',
            icon: 'IconSparkles',
            isActive: false,
            emit: {
                on: 'created',
                objectUniversalIdentifier: null,
                through: null
            }
        });
    });
    it('updates presentation directly for a type owned by the caller', ()=>{
        const result = (0, _fromupdatetimelineactivitytypeinputtoflattimelineactivitytypetoupdateorthrowutil.fromUpdateTimelineActivityTypeInputToFlatTimelineActivityTypeToUpdateOrThrow)({
            flatTimelineActivityTypeMaps,
            updateTimelineActivityTypeInput: {
                id: timelineActivityType.id,
                label: 'was added by'
            },
            callerApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
            workspaceCustomApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER
        });
        expect(result).toMatchObject({
            label: 'was added by',
            overrides: null
        });
    });
    it('stores translated labels in the workspace override', ()=>{
        const result = (0, _fromupdatetimelineactivitytypeinputtoflattimelineactivitytypetoupdateorthrowutil.fromUpdateTimelineActivityTypeInputToFlatTimelineActivityTypeToUpdateOrThrow)({
            flatTimelineActivityTypeMaps,
            updateTimelineActivityTypeInput: {
                id: timelineActivityType.id,
                translations: [
                    {
                        locale: 'fr-FR',
                        property: 'label',
                        value: 'a été créé par'
                    }
                ]
            },
            callerApplicationUniversalIdentifier: WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
            workspaceCustomApplicationUniversalIdentifier: WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
        });
        expect(result.overrides).toEqual({
            translations: {
                'fr-FR': {
                    label: 'a été créé par'
                }
            }
        });
    });
    it('rejects translations for non-translatable properties', ()=>{
        expect(()=>(0, _fromupdatetimelineactivitytypeinputtoflattimelineactivitytypetoupdateorthrowutil.fromUpdateTimelineActivityTypeInputToFlatTimelineActivityTypeToUpdateOrThrow)({
                flatTimelineActivityTypeMaps,
                updateTimelineActivityTypeInput: {
                    id: timelineActivityType.id,
                    translations: [
                        {
                            locale: 'fr-FR',
                            property: 'icon',
                            value: 'IconPlus'
                        }
                    ]
                },
                callerApplicationUniversalIdentifier: WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER,
                workspaceCustomApplicationUniversalIdentifier: WORKSPACE_CUSTOM_APPLICATION_UNIVERSAL_IDENTIFIER
            })).toThrow('Cannot translate timeline activity type properties: icon');
    });
});

//# sourceMappingURL=from-update-timeline-activity-type-input-to-flat-timeline-activity-type-to-update-or-throw.util.spec.js.map