"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _databaseeventaction = require("../../../../engine/api/graphql/graphql-query-runner/enums/database-event-action");
const _resolvetimelineactivityruleactionutil = require("../resolve-timeline-activity-rule-action.util");
const DIRECT_RELATION_TARGET_SHAPE = {
    kind: 'DIRECT_RELATION',
    targetJoinColumns: []
};
const JUNCTION_TARGET_SHAPE = {
    kind: 'JUNCTION',
    junctionObjectMetadataId: 'junction-object-id',
    junctionObjectNameSingular: 'junctionObject',
    junctionSourceJoinColumnName: 'sourceId',
    targetJoinColumns: []
};
describe('resolveTimelineActivityRuleAction', ()=>{
    const sourceCases = [
        {
            eventAction: _databaseeventaction.DatabaseEventAction.CREATED,
            declaredAction: 'linked',
            expectedAction: 'linked'
        },
        {
            eventAction: _databaseeventaction.DatabaseEventAction.RESTORED,
            declaredAction: 'linked',
            expectedAction: 'linked'
        },
        {
            eventAction: _databaseeventaction.DatabaseEventAction.DELETED,
            declaredAction: 'unlinked',
            expectedAction: 'unlinked'
        },
        {
            eventAction: _databaseeventaction.DatabaseEventAction.UPDATED,
            declaredAction: 'linked',
            expectedAction: 'linked'
        },
        {
            eventAction: _databaseeventaction.DatabaseEventAction.UPDATED,
            declaredAction: 'unlinked',
            expectedAction: 'unlinked'
        },
        {
            eventAction: _databaseeventaction.DatabaseEventAction.UPDATED,
            declaredAction: 'updated',
            expectedAction: 'updated'
        },
        {
            eventAction: _databaseeventaction.DatabaseEventAction.CREATED,
            declaredAction: 'created',
            expectedAction: 'created'
        }
    ];
    it.each(sourceCases)('maps $eventAction to $expectedAction for a direct $declaredAction rule', ({ eventAction, declaredAction, expectedAction })=>{
        expect((0, _resolvetimelineactivityruleactionutil.resolveTimelineActivityRuleAction)({
            actions: [
                declaredAction
            ],
            targetShape: DIRECT_RELATION_TARGET_SHAPE,
            eventAction,
            eventSource: 'SOURCE'
        })).toBe(expectedAction);
    });
    it.each([
        {
            eventAction: _databaseeventaction.DatabaseEventAction.CREATED,
            declaredAction: 'linked'
        },
        {
            eventAction: _databaseeventaction.DatabaseEventAction.RESTORED,
            declaredAction: 'linked'
        },
        {
            eventAction: _databaseeventaction.DatabaseEventAction.DELETED,
            declaredAction: 'unlinked'
        },
        {
            eventAction: _databaseeventaction.DatabaseEventAction.UPDATED,
            declaredAction: 'linked'
        },
        {
            eventAction: _databaseeventaction.DatabaseEventAction.UPDATED,
            declaredAction: 'unlinked'
        }
    ])('maps a junction $eventAction to $declaredAction', ({ eventAction, declaredAction })=>{
        expect((0, _resolvetimelineactivityruleactionutil.resolveTimelineActivityRuleAction)({
            actions: [
                declaredAction
            ],
            targetShape: JUNCTION_TARGET_SHAPE,
            eventAction,
            eventSource: 'JUNCTION'
        })).toBe(declaredAction);
    });
    it('does not treat a junction-row update as a source-record update', ()=>{
        expect((0, _resolvetimelineactivityruleactionutil.resolveTimelineActivityRuleAction)({
            actions: [
                'updated'
            ],
            targetShape: JUNCTION_TARGET_SHAPE,
            eventAction: _databaseeventaction.DatabaseEventAction.UPDATED,
            eventSource: 'JUNCTION'
        })).toBeUndefined();
    });
    it('does not derive link actions for self rules', ()=>{
        expect((0, _resolvetimelineactivityruleactionutil.resolveTimelineActivityRuleAction)({
            actions: [
                'linked'
            ],
            targetShape: {
                kind: 'SELF'
            },
            eventAction: _databaseeventaction.DatabaseEventAction.CREATED,
            eventSource: 'SOURCE'
        })).toBeUndefined();
    });
});

//# sourceMappingURL=resolve-timeline-activity-rule-action.util.spec.js.map