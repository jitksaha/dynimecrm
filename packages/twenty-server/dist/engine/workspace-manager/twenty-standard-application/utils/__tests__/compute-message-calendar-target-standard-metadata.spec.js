"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _validateindexwhereclauseutil = require("../../../workspace-migration/utils/validate-index-where-clause.util");
const _twentystandardapplicationallflatentitymapsconstant = require("../twenty-standard-application-all-flat-entity-maps.constant");
const WORKSPACE_ID = '20202020-1111-4111-8111-111111111111';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-2222-4222-8222-222222222222';
const NOW = '2024-01-01T00:00:00.000Z';
describe('Message and calendar target standard metadata build', ()=>{
    const { allFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
        now: NOW,
        workspaceId: WORKSPACE_ID,
        twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID
    });
    it.each([
        'calendarEventTarget',
        'messageThreadTarget'
    ])('builds %s as a system junction object without first-class views', (objectName)=>{
        const objectMetadata = allFlatEntityMaps.flatObjectMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS[objectName].universalIdentifier];
        expect(objectMetadata).toMatchObject({
            isSystem: true,
            isAuditLogged: false,
            isUICreatable: false
        });
        expect(Object.keys(_metadata.STANDARD_OBJECTS[objectName].views)).toHaveLength(0);
    });
    it.each([
        {
            parentObjectName: 'calendarEvent',
            parentTargetField: _metadata.STANDARD_OBJECTS.calendarEvent.fields.calendarEventTargets,
            targetField: _metadata.STANDARD_OBJECTS.calendarEventTarget.fields.targetPerson
        },
        {
            parentObjectName: 'messageThread',
            parentTargetField: _metadata.STANDARD_OBJECTS.messageThread.fields.messageThreadTargets,
            targetField: _metadata.STANDARD_OBJECTS.messageThreadTarget.fields.targetPerson
        }
    ])('configures $parentObjectName targets for the generic junction relation path', ({ parentTargetField, targetField })=>{
        const parentTargetFieldMetadata = allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[parentTargetField.universalIdentifier];
        expect(parentTargetFieldMetadata).toMatchObject({
            universalSettings: {
                junctionTargetFieldUniversalIdentifier: targetField.universalIdentifier
            }
        });
    });
    it.each([
        'calendarEventTarget',
        'messageThreadTarget'
    ])('indexes each %s target relation for target-first timeline reads', (objectName)=>{
        for (const indexName of [
            'personIdIndex',
            'companyIdIndex',
            'opportunityIdIndex'
        ]){
            const { universalIdentifier } = _metadata.STANDARD_OBJECTS[objectName].indexes[indexName];
            const indexMetadata = allFlatEntityMaps.flatIndexMaps.byUniversalIdentifier[universalIdentifier];
            expect(indexMetadata).toMatchObject({
                isUnique: false,
                indexWhereClause: null
            });
            expect(indexMetadata?.flatIndexFieldMetadatas).toHaveLength(1);
        }
    });
    it.each([
        'calendarEventTarget',
        'messageThreadTarget'
    ])('uses one morph group for all %s target types', (objectName)=>{
        const targetFields = [
            _metadata.STANDARD_OBJECTS[objectName].fields.targetPerson,
            _metadata.STANDARD_OBJECTS[objectName].fields.targetCompany,
            _metadata.STANDARD_OBJECTS[objectName].fields.targetOpportunity
        ].map(({ universalIdentifier })=>allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[universalIdentifier]);
        expect(targetFields).toHaveLength(3);
        expect(targetFields.every((field)=>field?.isUIEditable === false)).toBe(true);
        expect(new Set(targetFields.map((field)=>field?.morphId))).toEqual(new Set([
            _metadata.STANDARD_OBJECTS[objectName].morphIds.targetMorphId.morphId
        ]));
    });
    it.each([
        {
            objectName: 'calendarEventTarget',
            indexes: [
                _metadata.STANDARD_OBJECTS.calendarEventTarget.indexes.calendarEventPersonUniqueIndex,
                _metadata.STANDARD_OBJECTS.calendarEventTarget.indexes.calendarEventCompanyUniqueIndex,
                _metadata.STANDARD_OBJECTS.calendarEventTarget.indexes.calendarEventOpportunityUniqueIndex
            ]
        },
        {
            objectName: 'messageThreadTarget',
            indexes: [
                _metadata.STANDARD_OBJECTS.messageThreadTarget.indexes.messageThreadPersonUniqueIndex,
                _metadata.STANDARD_OBJECTS.messageThreadTarget.indexes.messageThreadCompanyUniqueIndex,
                _metadata.STANDARD_OBJECTS.messageThreadTarget.indexes.messageThreadOpportunityUniqueIndex
            ]
        }
    ])('allows only one live $objectName row per target', ({ indexes })=>{
        for (const { universalIdentifier } of indexes){
            const indexMetadata = allFlatEntityMaps.flatIndexMaps.byUniversalIdentifier[universalIdentifier];
            expect(indexMetadata).toMatchObject({
                isUnique: true
            });
            expect(indexMetadata?.indexWhereClause).toBe('"deletedAt" IS NULL');
            expect((0, _validateindexwhereclauseutil.validateAndReturnIndexWhereClause)(indexMetadata?.indexWhereClause)).toBe('"deletedAt" IS NULL');
        }
    });
    it.each([
        'calendarEventTarget',
        'messageThreadTarget'
    ])('defaults manual %s rows to manual provenance only', (objectName)=>{
        const automaticField = allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS[objectName].fields.isAutomaticallyAssigned.universalIdentifier];
        const manualField = allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECTS[objectName].fields.isManuallyAssigned.universalIdentifier];
        expect(automaticField).toMatchObject({
            defaultValue: false,
            isUIEditable: false
        });
        expect(manualField).toMatchObject({
            defaultValue: true,
            isUIEditable: false
        });
    });
});

//# sourceMappingURL=compute-message-calendar-target-standard-metadata.spec.js.map