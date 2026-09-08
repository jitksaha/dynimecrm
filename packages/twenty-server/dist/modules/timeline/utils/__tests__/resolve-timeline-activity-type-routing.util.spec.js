"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _standardtimelineactivitytypedefinitionsconstant = require("../../../../engine/metadata-modules/timeline-activity-type/constants/standard-timeline-activity-type-definitions.constant");
const _resolvetimelineactivitytyperoutingutil = require("../resolve-timeline-activity-type-routing.util");
const noteUpdatedDefinition = _standardtimelineactivitytypedefinitionsconstant.STANDARD_TIMELINE_ACTIVITY_TYPE_DEFINITIONS.find(({ name })=>name === 'noteUpdated');
const messageLinkedDefinition = _standardtimelineactivitytypedefinitionsconstant.STANDARD_TIMELINE_ACTIVITY_TYPE_DEFINITIONS.find(({ name })=>name === 'messageLinked');
if (!noteUpdatedDefinition || !messageLinkedDefinition) {
    throw new Error('Missing standard timeline activity type definitions');
}
const timelineActivityType = {
    universalIdentifier: noteUpdatedDefinition.universalIdentifier,
    applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
    targetRelationFieldUniversalIdentifier: null,
    triggerFieldUniversalIdentifiers: null,
    happensAtFieldUniversalIdentifier: null
};
describe('resolveTimelineActivityTypeRouting', ()=>{
    it('uses frozen standard routing while a workspace is still upgrading', ()=>{
        expect((0, _resolvetimelineactivitytyperoutingutil.resolveTimelineActivityTypeRouting)(timelineActivityType)).toEqual({
            targetRelationFieldUniversalIdentifier: noteUpdatedDefinition.targetRelationFieldUniversalIdentifier,
            triggerFieldUniversalIdentifiers: noteUpdatedDefinition.triggerFieldUniversalIdentifiers,
            happensAtFieldUniversalIdentifier: null
        });
    });
    it('does not grant the standard compatibility fallback to applications', ()=>{
        expect((0, _resolvetimelineactivitytyperoutingutil.resolveTimelineActivityTypeRouting)({
            ...timelineActivityType,
            applicationUniversalIdentifier: '00000000-0000-4000-8000-000000000001'
        })).toBeUndefined();
    });
    it('prefers synced routing once the workspace command has run', ()=>{
        expect((0, _resolvetimelineactivitytyperoutingutil.resolveTimelineActivityTypeRouting)({
            ...timelineActivityType,
            targetRelationFieldUniversalIdentifier: '00000000-0000-4000-8000-000000000002',
            triggerFieldUniversalIdentifiers: [
                '00000000-0000-4000-8000-000000000003'
            ]
        })).toEqual({
            targetRelationFieldUniversalIdentifier: '00000000-0000-4000-8000-000000000002',
            triggerFieldUniversalIdentifiers: [
                '00000000-0000-4000-8000-000000000003'
            ],
            happensAtFieldUniversalIdentifier: null
        });
    });
    it('uses the frozen standard happensAt field while a workspace is still upgrading', ()=>{
        expect((0, _resolvetimelineactivitytyperoutingutil.resolveTimelineActivityTypeRouting)({
            ...timelineActivityType,
            universalIdentifier: messageLinkedDefinition.universalIdentifier
        })).toEqual({
            targetRelationFieldUniversalIdentifier: messageLinkedDefinition.targetRelationFieldUniversalIdentifier,
            triggerFieldUniversalIdentifiers: null,
            happensAtFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.message.fields.receivedAt.universalIdentifier
        });
    });
    it('prefers the synced happensAt field once the workspace command has run', ()=>{
        expect((0, _resolvetimelineactivitytyperoutingutil.resolveTimelineActivityTypeRouting)({
            ...timelineActivityType,
            universalIdentifier: messageLinkedDefinition.universalIdentifier,
            targetRelationFieldUniversalIdentifier: messageLinkedDefinition.targetRelationFieldUniversalIdentifier ?? null,
            happensAtFieldUniversalIdentifier: '00000000-0000-4000-8000-000000000004'
        })).toEqual({
            targetRelationFieldUniversalIdentifier: messageLinkedDefinition.targetRelationFieldUniversalIdentifier,
            triggerFieldUniversalIdentifiers: null,
            happensAtFieldUniversalIdentifier: '00000000-0000-4000-8000-000000000004'
        });
    });
    it('does not grant the standard happensAt fallback to applications', ()=>{
        expect((0, _resolvetimelineactivitytyperoutingutil.resolveTimelineActivityTypeRouting)({
            ...timelineActivityType,
            universalIdentifier: messageLinkedDefinition.universalIdentifier,
            applicationUniversalIdentifier: '00000000-0000-4000-8000-000000000001',
            targetRelationFieldUniversalIdentifier: messageLinkedDefinition.targetRelationFieldUniversalIdentifier ?? null
        })).toEqual({
            targetRelationFieldUniversalIdentifier: messageLinkedDefinition.targetRelationFieldUniversalIdentifier,
            triggerFieldUniversalIdentifiers: null,
            happensAtFieldUniversalIdentifier: null
        });
    });
});

//# sourceMappingURL=resolve-timeline-activity-type-routing.util.spec.js.map