"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _timelineactivitytypeupgradecommandnameconstants = require("../../../../../database/commands/upgrade-version-command/2-34/timeline-activity-type-upgrade-command-name.constants");
const _droptimelineactivitytyperendererupgradecommandnameconstant = require("../../../../../database/commands/upgrade-version-command/2-35/drop-timeline-activity-type-renderer-upgrade-command-name.constant");
const _timelineactivityhappensatupgradecommandnameconstant = require("../../../../../database/commands/upgrade-version-command/2-38/timeline-activity-happens-at-upgrade-command-name.constant");
const _resolveentityshapeatupgradecursorutil = require("../../../../core-modules/upgrade/utils/resolve-entity-shape-at-upgrade-cursor.util");
const _timelineactivitytypeentity = require("../timeline-activity-type.entity");
const CURRENT_COLUMNS = [
    'renderer',
    'frontComponentUniversalIdentifier',
    'targetRelationFieldUniversalIdentifier',
    'triggerFieldUniversalIdentifiers',
    'happensAtFieldUniversalIdentifier',
    'replacesTimelineActivityTypeUniversalIdentifier',
    'overrides',
    'isActive'
].map((propertyName)=>({
        propertyName,
        databaseName: propertyName
    }));
const resolveAt = (appliedSteps)=>(0, _resolveentityshapeatupgradecursorutil.resolveEntityShapeAtUpgradeCursor)({
        entityClass: _timelineactivitytypeentity.TimelineActivityTypeEntity,
        currentTableName: 'timelineActivityType',
        currentColumns: CURRENT_COLUMNS,
        isStepApplied: (stepName)=>appliedSteps.includes(stepName)
    });
describe('TimelineActivityTypeEntity upgrade shape', ()=>{
    it('hides every 2.34 column while 2.33 workspace commands run', ()=>{
        expect(resolveAt([]).hiddenPropertyNames).toEqual(new Set(CURRENT_COLUMNS.map(({ propertyName })=>propertyName).filter((propertyName)=>propertyName !== 'renderer')));
    });
    it('reveals each column only after its instance command', ()=>{
        expect(resolveAt([
            _timelineactivitytypeupgradecommandnameconstants.REFACTOR_TIMELINE_ACTIVITY_TYPE_RENDERING_UPGRADE_COMMAND_NAME
        ]).hiddenPropertyNames).toEqual(new Set([
            'targetRelationFieldUniversalIdentifier',
            'triggerFieldUniversalIdentifiers',
            'happensAtFieldUniversalIdentifier',
            'replacesTimelineActivityTypeUniversalIdentifier',
            'overrides',
            'isActive'
        ]));
        expect(resolveAt([
            _timelineactivitytypeupgradecommandnameconstants.REFACTOR_TIMELINE_ACTIVITY_TYPE_RENDERING_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_ROUTING_UPGRADE_COMMAND_NAME
        ]).hiddenPropertyNames).toEqual(new Set([
            'happensAtFieldUniversalIdentifier',
            'replacesTimelineActivityTypeUniversalIdentifier',
            'overrides',
            'isActive'
        ]));
        expect(resolveAt([
            _timelineactivitytypeupgradecommandnameconstants.REFACTOR_TIMELINE_ACTIVITY_TYPE_RENDERING_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_ROUTING_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_TYPE_REPLACEMENT_UPGRADE_COMMAND_NAME
        ]).hiddenPropertyNames).toEqual(new Set([
            'happensAtFieldUniversalIdentifier',
            'overrides',
            'isActive'
        ]));
        expect(resolveAt([
            _timelineactivitytypeupgradecommandnameconstants.REFACTOR_TIMELINE_ACTIVITY_TYPE_RENDERING_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_ROUTING_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_TYPE_REPLACEMENT_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.TIMELINE_ACTIVITY_TYPE_OVERRIDABLE_ENTITY_UPGRADE_COMMAND_NAME
        ]).hiddenPropertyNames).toEqual(new Set([
            'happensAtFieldUniversalIdentifier'
        ]));
        expect(resolveAt([
            _timelineactivitytypeupgradecommandnameconstants.REFACTOR_TIMELINE_ACTIVITY_TYPE_RENDERING_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_ROUTING_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_TYPE_REPLACEMENT_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.TIMELINE_ACTIVITY_TYPE_OVERRIDABLE_ENTITY_UPGRADE_COMMAND_NAME,
            _droptimelineactivitytyperendererupgradecommandnameconstant.DROP_TIMELINE_ACTIVITY_TYPE_RENDERER_UPGRADE_COMMAND_NAME
        ]).hiddenPropertyNames).toEqual(new Set([
            'renderer',
            'happensAtFieldUniversalIdentifier'
        ]));
        expect(resolveAt([
            _timelineactivitytypeupgradecommandnameconstants.REFACTOR_TIMELINE_ACTIVITY_TYPE_RENDERING_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_ROUTING_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_TYPE_REPLACEMENT_UPGRADE_COMMAND_NAME,
            _timelineactivitytypeupgradecommandnameconstants.TIMELINE_ACTIVITY_TYPE_OVERRIDABLE_ENTITY_UPGRADE_COMMAND_NAME,
            _droptimelineactivitytyperendererupgradecommandnameconstant.DROP_TIMELINE_ACTIVITY_TYPE_RENDERER_UPGRADE_COMMAND_NAME,
            _timelineactivityhappensatupgradecommandnameconstant.ADD_TIMELINE_ACTIVITY_HAPPENS_AT_FIELD_UPGRADE_COMMAND_NAME
        ]).hiddenPropertyNames).toEqual(new Set([
            'renderer'
        ]));
    });
});

//# sourceMappingURL=timeline-activity-type-upgrade-shape.spec.js.map