"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityService", {
    enumerable: true,
    get: function() {
        return TimelineActivityService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _getflatfieldsforflatobjectmetadatautil = require("../../../engine/api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _parseeventname = require("../../../engine/workspace-event-emitter/utils/parse-event-name");
const _timelineactivityrepository = require("../repositories/timeline-activity.repository");
const _timelineactivityroutingplanservice = require("./timeline-activity-routing-plan.service");
const _timelineactivitytargetqueryservice = require("./timeline-activity-target-query.service");
const _buildlinkedtimelineactivityhappensatsyncupdatesutil = require("../utils/build-linked-timeline-activity-happens-at-sync-updates.util");
const _resolvelinkedrecordcachednameutil = require("../utils/resolve-linked-record-cached-name.util");
const _resolvetimelineactivityhappensatutil = require("../utils/resolve-timeline-activity-happens-at.util");
const _workspacememberworkspaceentity = require("../../workspace-member/standard-objects/workspace-member.workspace-entity");
const _doesobjectrecordeventchangefieldsutil = require("../utils/does-object-record-event-change-fields.util");
const _resolvetimelineactivityruleactionutil = require("../utils/resolve-timeline-activity-rule-action.util");
const _resolvetimelineactivitytypeforruleutil = require("../utils/resolve-timeline-activity-type-for-rule.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
// Only the diff is worth storing: the rest of an event payload is the record
// itself, which the timeline reads live.
const keepDiffOnly = (properties)=>{
    const { diff } = properties;
    return (0, _utils.isDefined)(diff) && Object.keys(diff).length > 0 ? {
        diff
    } : {};
};
const resolveEventRecordForRuleAction = ({ event, eventAction, ruleAction })=>eventAction === 'deleted' || ruleAction === 'unlinked' ? event.properties.before ?? event.properties.after : event.properties.after ?? event.properties.before;
const buildLinkedPayload = ({ rule, timelineActivityType, target, workspaceMemberId, linkedRecordId, linkedRecordCachedName, happensAt, properties })=>({
        happensAt,
        timelineActivityTypeId: timelineActivityType.id,
        timelineActivityTypeSnapshot: timelineActivityType.snapshot,
        objectSingularName: target.targetObjectNameSingular,
        recordId: target.targetRecordId,
        workspaceMemberId,
        linkedRecordId,
        linkedObjectMetadataId: rule.sourceFlatObjectMetadata.id,
        linkedRecordCachedName,
        properties: keepDiffOnly(properties)
    });
let TimelineActivityService = class TimelineActivityService {
    async upsertEvents({ events, name, objectMetadata, workspaceId }) {
        if (!(0, _utils.isDefined)(workspaceId)) {
            return;
        }
        const { action } = (0, _parseeventname.parseEventNameOrThrow)(name);
        const { sourceRules, junctionRules, flatFieldMetadataMaps, resolveTimelineActivityType } = await this.timelineActivityRoutingPlanService.getRulesForEventBatch({
            workspaceId,
            flatObjectMetadata: objectMetadata
        });
        if (sourceRules.length === 0 && junctionRules.length === 0) {
            return;
        }
        const eventsWithoutPositionDiff = this.excludePositionFieldsFromEventsDiff({
            events,
            objectMetadata,
            flatFieldMetadataMaps
        });
        const payloads = (await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            // Resolved after the rule check so batches without rules, system
            // objects mostly, never pay the workspace member query.
            const enrichedEvents = await this.enrichEventsWithWorkspaceMemberId({
                events: eventsWithoutPositionDiff
            });
            return Promise.all([
                ...sourceRules.map((rule)=>this.buildPayloadsForSourceRule({
                        rule,
                        events: enrichedEvents,
                        action,
                        flatFieldMetadataMaps,
                        resolveTimelineActivityType
                    })),
                ...junctionRules.map((rule)=>this.buildPayloadsForJunctionRule({
                        rule,
                        events: enrichedEvents,
                        action,
                        flatFieldMetadataMaps,
                        resolveTimelineActivityType
                    }))
            ]);
        }, (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId))).flat();
        if (action === 'updated') {
            await this.timelineActivityRepository.updateLinkedTimelineActivitiesHappensAt({
                workspaceId,
                updates: (0, _buildlinkedtimelineactivityhappensatsyncupdatesutil.buildLinkedTimelineActivityHappensAtSyncUpdates)({
                    rules: sourceRules,
                    events: eventsWithoutPositionDiff,
                    resolveTimelineActivityType
                })
            });
        }
        if (payloads.length === 0) {
            return;
        }
        const payloadsByObjectSingularName = (0, _utils.fromArrayToValuesByKeyRecord)({
            array: payloads,
            key: 'objectSingularName'
        });
        for(const objectSingularName in payloadsByObjectSingularName){
            await this.timelineActivityRepository.upsertTimelineActivities({
                objectSingularName,
                workspaceId,
                payloads: payloadsByObjectSingularName[objectSingularName]
            });
        }
    }
    ruleMatchesEvent({ rule, ruleAction, event }) {
        if (!rule.actions.includes(ruleAction)) {
            return false;
        }
        if (ruleAction !== 'updated' || !(0, _utils.isDefined)(rule.triggerFieldNames)) {
            return true;
        }
        const diff = event.properties.diff;
        if (!(0, _utils.isDefined)(diff)) {
            return false;
        }
        return rule.triggerFieldNames.some((fieldName)=>(0, _utils.isDefined)(diff[fieldName]));
    }
    async buildPayloadsForSourceRule({ rule, events, action, flatFieldMetadataMaps, resolveTimelineActivityType }) {
        const ruleAction = (0, _resolvetimelineactivityruleactionutil.resolveTimelineActivityRuleAction)({
            actions: rule.actions,
            targetShape: rule.targetShape,
            eventAction: action,
            eventSource: 'SOURCE'
        });
        if (!(0, _utils.isDefined)(ruleAction)) {
            return [];
        }
        const timelineActivityType = (0, _resolvetimelineactivitytypeforruleutil.resolveTimelineActivityTypeForRule)({
            rule,
            ruleAction,
            resolveTimelineActivityType
        });
        if (!(0, _utils.isDefined)(timelineActivityType)) {
            return [];
        }
        const matchingEvents = events.filter((event)=>rule.targetShape.kind !== 'DIRECT_RELATION' || action !== 'updated' || ruleAction === 'updated' || (0, _doesobjectrecordeventchangefieldsutil.doesObjectRecordEventChangeFields)({
                event,
                fieldNames: rule.targetShape.targetJoinColumns.map(({ joinColumnName })=>joinColumnName)
            })).filter((event)=>this.ruleMatchesEvent({
                rule,
                ruleAction,
                event
            }));
        if (matchingEvents.length === 0) {
            return [];
        }
        const { nameSingular } = rule.sourceFlatObjectMetadata;
        if (rule.targetShape.kind === 'SELF') {
            return matchingEvents.flatMap((event)=>{
                const properties = ruleAction === 'updated' ? keepDiffOnly(event.properties) : {};
                // An update whose whole diff was filtered out has nothing to show
                if (ruleAction === 'updated' && !(0, _utils.isDefined)(properties.diff)) {
                    return [];
                }
                return [
                    {
                        timelineActivityTypeId: timelineActivityType.id,
                        timelineActivityTypeSnapshot: timelineActivityType.snapshot,
                        happensAt: (0, _resolvetimelineactivityhappensatutil.resolveTimelineActivityHappensAt)(event),
                        objectSingularName: nameSingular,
                        recordId: event.recordId,
                        workspaceMemberId: event.workspaceMemberId,
                        properties
                    }
                ];
            });
        }
        if (rule.targetShape.kind === 'DIRECT_RELATION') {
            return matchingEvents.flatMap((event)=>{
                const record = resolveEventRecordForRuleAction({
                    event,
                    eventAction: action,
                    ruleAction
                });
                const target = this.timelineActivityTargetQueryService.resolveTargetFromRecord({
                    rule,
                    record
                });
                if (!(0, _utils.isDefined)(target)) {
                    return [];
                }
                return [
                    buildLinkedPayload({
                        rule,
                        timelineActivityType,
                        target,
                        workspaceMemberId: event.workspaceMemberId,
                        linkedRecordId: event.recordId,
                        linkedRecordCachedName: (0, _resolvelinkedrecordcachednameutil.resolveLinkedRecordCachedName)({
                            rule,
                            record,
                            flatFieldMetadataMaps
                        }),
                        happensAt: (0, _resolvetimelineactivityhappensatutil.resolveLinkedTimelineActivityHappensAt)({
                            event,
                            ruleAction,
                            happensAtFieldName: rule.happensAtFieldName,
                            sourceRecord: record
                        }),
                        properties: event.properties
                    })
                ];
            });
        }
        const targetsBySourceRecordId = await this.timelineActivityTargetQueryService.resolveTargetsBySourceRecordId({
            rule,
            sourceRecordIds: matchingEvents.map((event)=>event.recordId)
        });
        return matchingEvents.flatMap((event)=>(targetsBySourceRecordId.get(event.recordId) ?? []).map((target)=>buildLinkedPayload({
                    rule,
                    timelineActivityType,
                    target,
                    workspaceMemberId: event.workspaceMemberId,
                    linkedRecordId: event.recordId,
                    linkedRecordCachedName: (0, _resolvelinkedrecordcachednameutil.resolveLinkedRecordCachedName)({
                        rule,
                        record: event.properties.after,
                        flatFieldMetadataMaps
                    }),
                    happensAt: (0, _resolvetimelineactivityhappensatutil.resolveLinkedTimelineActivityHappensAt)({
                        event,
                        ruleAction,
                        happensAtFieldName: rule.happensAtFieldName,
                        sourceRecord: event.properties.after
                    }),
                    properties: event.properties
                })));
    }
    async buildPayloadsForJunctionRule({ rule, events, action, flatFieldMetadataMaps, resolveTimelineActivityType }) {
        const ruleAction = (0, _resolvetimelineactivityruleactionutil.resolveTimelineActivityRuleAction)({
            actions: rule.actions,
            targetShape: rule.targetShape,
            eventAction: action,
            eventSource: 'JUNCTION'
        });
        if (!(0, _utils.isDefined)(ruleAction) || rule.targetShape.kind !== 'JUNCTION') {
            return [];
        }
        const timelineActivityType = (0, _resolvetimelineactivitytypeforruleutil.resolveTimelineActivityTypeForRule)({
            rule,
            ruleAction,
            resolveTimelineActivityType
        });
        if (!(0, _utils.isDefined)(timelineActivityType)) {
            return [];
        }
        const targetShape = rule.targetShape;
        const { junctionSourceJoinColumnName } = targetShape;
        const eventsWithJunctionRecord = events.filter((event)=>action !== 'updated' || (0, _doesobjectrecordeventchangefieldsutil.doesObjectRecordEventChangeFields)({
                event,
                fieldNames: [
                    targetShape.junctionSourceJoinColumnName,
                    ...targetShape.targetJoinColumns.map(({ joinColumnName })=>joinColumnName)
                ]
            })).filter((event)=>this.ruleMatchesEvent({
                rule,
                ruleAction,
                event
            })).map((event)=>{
            const junctionRecord = resolveEventRecordForRuleAction({
                event,
                eventAction: action,
                ruleAction
            });
            const target = this.timelineActivityTargetQueryService.resolveTargetFromRecord({
                rule,
                record: junctionRecord
            });
            const sourceRecordId = junctionRecord?.[junctionSourceJoinColumnName];
            if (!(0, _utils.isDefined)(target) || !(0, _guards.isNonEmptyString)(sourceRecordId)) {
                return undefined;
            }
            return {
                event,
                target,
                sourceRecordId
            };
        }).filter(_utils.isDefined);
        if (eventsWithJunctionRecord.length === 0) {
            return [];
        }
        const sourceRecordsByRecordId = await this.timelineActivityTargetQueryService.findSourceRecordsByRecordId({
            rule,
            recordIds: eventsWithJunctionRecord.map(({ sourceRecordId })=>sourceRecordId)
        });
        // The junction event is the semantic fact; this enrichment read can race
        // the transaction that created the linked record.
        return eventsWithJunctionRecord.map(({ event, target, sourceRecordId })=>{
            const sourceRecord = sourceRecordsByRecordId.get(sourceRecordId);
            return buildLinkedPayload({
                rule,
                timelineActivityType,
                target,
                workspaceMemberId: event.workspaceMemberId,
                linkedRecordId: sourceRecordId,
                linkedRecordCachedName: (0, _resolvelinkedrecordcachednameutil.resolveLinkedRecordCachedName)({
                    rule,
                    record: sourceRecord,
                    flatFieldMetadataMaps
                }),
                happensAt: (0, _resolvetimelineactivityhappensatutil.resolveLinkedTimelineActivityHappensAt)({
                    event,
                    ruleAction,
                    happensAtFieldName: rule.happensAtFieldName,
                    sourceRecord
                }),
                properties: {}
            });
        });
    }
    async enrichEventsWithWorkspaceMemberId({ events }) {
        const userIds = events.map((event)=>event.userId).filter(_utils.isDefined);
        if (userIds.length === 0) {
            return events;
        }
        const workspaceMemberRepository = this.workspaceOrmManager.getRepository(_workspacememberworkspaceentity.WorkspaceMemberWorkspaceEntity, {
            shouldBypassPermissionChecks: true
        });
        const workspaceMembers = await workspaceMemberRepository.findBy({
            userId: (0, _typeorm.In)(userIds)
        });
        return events.map((event)=>{
            const workspaceMember = workspaceMembers.find((member)=>member.userId === event.userId);
            return (0, _utils.isDefined)(event.userId) && (0, _utils.isDefined)(workspaceMember) ? {
                ...event,
                workspaceMemberId: workspaceMember.id
            } : event;
        });
    }
    // Position changes reach other consumers (SSE, webhooks, workflows) but render
    // blank in the timeline, so exclude them to avoid empty activity rows.
    excludePositionFieldsFromEventsDiff({ events, objectMetadata, flatFieldMetadataMaps }) {
        const someEventHasDiff = events.some((event)=>(0, _utils.isDefined)(event.properties.diff));
        if (!someEventHasDiff) {
            return events;
        }
        const positionFieldNames = new Set((0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(objectMetadata, flatFieldMetadataMaps).filter((field)=>field.type === _types.FieldMetadataType.POSITION).map((field)=>field.name));
        if (positionFieldNames.size === 0) {
            return events;
        }
        return events.map((event)=>{
            const diff = event.properties.diff;
            if (!(0, _utils.isDefined)(diff)) {
                return event;
            }
            const diffWithoutPositionFields = Object.fromEntries(Object.entries(diff).filter(([fieldName])=>!positionFieldNames.has(fieldName)));
            return {
                ...event,
                properties: {
                    ...event.properties,
                    diff: diffWithoutPositionFields
                }
            };
        });
    }
    constructor(timelineActivityRepository, workspaceOrmManager, timelineActivityRoutingPlanService, timelineActivityTargetQueryService){
        this.timelineActivityRepository = timelineActivityRepository;
        this.workspaceOrmManager = workspaceOrmManager;
        this.timelineActivityRoutingPlanService = timelineActivityRoutingPlanService;
        this.timelineActivityTargetQueryService = timelineActivityTargetQueryService;
    }
};
TimelineActivityService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _timelineactivityrepository.TimelineActivityRepository === "undefined" ? Object : _timelineactivityrepository.TimelineActivityRepository,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _timelineactivityroutingplanservice.TimelineActivityRoutingPlanService === "undefined" ? Object : _timelineactivityroutingplanservice.TimelineActivityRoutingPlanService,
        typeof _timelineactivitytargetqueryservice.TimelineActivityTargetQueryService === "undefined" ? Object : _timelineactivitytargetqueryservice.TimelineActivityTargetQueryService
    ])
], TimelineActivityService);

//# sourceMappingURL=timeline-activity.service.js.map