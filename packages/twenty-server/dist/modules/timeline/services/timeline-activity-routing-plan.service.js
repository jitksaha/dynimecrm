"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityRoutingPlanService", {
    enumerable: true,
    get: function() {
        return TimelineActivityRoutingPlanService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _workspacemanyorallflatentitymapscacheservice = require("../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyuniversalidentifierutil = require("../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _builddirectrelationtargetshapeutil = require("../utils/build-direct-relation-target-shape.util");
const _buildjunctiontargetshapeutil = require("../utils/build-junction-target-shape.util");
const _buildtimelineactivityselfruleutil = require("../utils/build-timeline-activity-self-rule.util");
const _resolvetimelineactivitytyperoutingutil = require("../utils/resolve-timeline-activity-type-routing.util");
const _resolvetimelineactivitytypeutil = require("../utils/resolve-timeline-activity-type.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TimelineActivityRoutingPlanService = class TimelineActivityRoutingPlanService {
    async shouldProcessEvent({ flatObjectMetadata, workspaceId }) {
        if (flatObjectMetadata.isAuditLogged) {
            return true;
        }
        const routingPlan = await this.getRoutingPlan(workspaceId);
        return routingPlan.eligibleNonAuditedObjectMetadataIds.has(flatObjectMetadata.id);
    }
    async getRulesForEventBatch({ workspaceId, flatObjectMetadata }) {
        const routingPlan = await this.getRoutingPlan(workspaceId);
        const selfRule = (0, _buildtimelineactivityselfruleutil.buildTimelineActivitySelfRule)({
            flatObjectMetadata,
            timelineActivityTypes: routingPlan.activeTimelineActivityTypes
        });
        return {
            sourceRules: [
                ...(0, _utils.isDefined)(selfRule) ? [
                    selfRule
                ] : [],
                ...routingPlan.throughRules.filter((rule)=>rule.sourceFlatObjectMetadata.id === flatObjectMetadata.id)
            ],
            junctionRules: routingPlan.throughRules.filter((rule)=>rule.targetShape.kind === 'JUNCTION' && rule.targetShape.junctionObjectMetadataId === flatObjectMetadata.id),
            flatFieldMetadataMaps: routingPlan.flatFieldMetadataMaps,
            resolveTimelineActivityType: routingPlan.resolveTimelineActivityType
        };
    }
    async getRoutingPlan(workspaceId) {
        const { data, hashes } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMapsWithHashes({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps',
                'flatFieldMetadataMapsOrm',
                'flatTimelineActivityTypeMaps'
            ]
        });
        const cacheKey = [
            hashes.flatObjectMetadataMaps,
            hashes.flatFieldMetadataMapsOrm,
            hashes.flatTimelineActivityTypeMaps
        ].join('|');
        const cachedRoutingPlan = this.routingPlanByWorkspaceId.get(workspaceId);
        if (cachedRoutingPlan?.cacheKey === cacheKey) {
            return cachedRoutingPlan.routingPlan;
        }
        const routingPlan = this.buildRoutingPlan(data);
        this.routingPlanByWorkspaceId.set(workspaceId, {
            cacheKey,
            routingPlan
        });
        return routingPlan;
    }
    buildRoutingPlan({ flatObjectMetadataMaps, flatFieldMetadataMapsOrm: flatFieldMetadataMaps, flatTimelineActivityTypeMaps }) {
        const { effectiveTimelineActivityTypes, resolveTimelineActivityType } = (0, _resolvetimelineactivitytypeutil.buildTimelineActivityTypeResolution)({
            ...flatTimelineActivityTypeMaps,
            objectMetadataByUniversalIdentifier: flatObjectMetadataMaps.byUniversalIdentifier
        });
        const activeTimelineActivityTypes = effectiveTimelineActivityTypes.filter((timelineActivityType)=>timelineActivityType.isActive);
        const throughRules = activeTimelineActivityTypes.map((timelineActivityType)=>{
            const routing = (0, _resolvetimelineactivitytyperoutingutil.resolveTimelineActivityTypeRouting)(timelineActivityType);
            if (!(0, _utils.isDefined)(timelineActivityType.action) || !(0, _utils.isDefined)(timelineActivityType.objectUniversalIdentifier) || !(0, _utils.isDefined)(routing)) {
                return undefined;
            }
            const sourceFlatObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: flatObjectMetadataMaps,
                universalIdentifier: timelineActivityType.objectUniversalIdentifier
            });
            const relationFlatFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: flatFieldMetadataMaps,
                universalIdentifier: routing.targetRelationFieldUniversalIdentifier
            });
            if (!(0, _utils.isDefined)(sourceFlatObjectMetadata) || !(0, _utils.isDefined)(relationFlatFieldMetadata)) {
                return undefined;
            }
            const targetShape = (0, _builddirectrelationtargetshapeutil.buildDirectRelationTargetShape)({
                relationFlatFieldMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            }) ?? (0, _buildjunctiontargetshapeutil.buildJunctionTargetShape)({
                relationFlatFieldMetadata,
                flatObjectMetadataMaps,
                flatFieldMetadataMaps
            });
            if (!(0, _utils.isDefined)(targetShape)) {
                return undefined;
            }
            const happensAtFlatFieldMetadata = (0, _utils.isDefined)(routing.happensAtFieldUniversalIdentifier) ? (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: flatFieldMetadataMaps,
                universalIdentifier: routing.happensAtFieldUniversalIdentifier
            }) : undefined;
            return {
                sourceFlatObjectMetadata,
                actions: [
                    timelineActivityType.action
                ],
                timelineActivityType: (0, _resolvetimelineactivitytypeutil.toResolvedTimelineActivityType)(timelineActivityType),
                triggerFieldNames: routing.triggerFieldUniversalIdentifiers?.map((universalIdentifier)=>(0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                        flatEntityMaps: flatFieldMetadataMaps,
                        universalIdentifier
                    })?.name).filter(_utils.isDefined) ?? null,
                // A field from another object would make the write path read a value
                // that is not the source record's own moment, so it is dropped here.
                happensAtFieldName: (0, _utils.isDefined)(happensAtFlatFieldMetadata) && happensAtFlatFieldMetadata.objectMetadataId === sourceFlatObjectMetadata.id ? happensAtFlatFieldMetadata.name : null,
                targetShape
            };
        }).filter(_utils.isDefined);
        const eligibleNonAuditedObjectMetadataIds = new Set(throughRules.flatMap((rule)=>[
                rule.sourceFlatObjectMetadata.id,
                ...rule.targetShape.kind === 'JUNCTION' ? [
                    rule.targetShape.junctionObjectMetadataId
                ] : []
            ]));
        for (const timelineActivityType of activeTimelineActivityTypes){
            if (!(0, _utils.isDefined)(timelineActivityType.action) || !(0, _utils.isDefined)(timelineActivityType.objectUniversalIdentifier) || (0, _utils.isDefined)((0, _resolvetimelineactivitytyperoutingutil.resolveTimelineActivityTypeRouting)(timelineActivityType))) {
                continue;
            }
            const flatObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: flatObjectMetadataMaps,
                universalIdentifier: timelineActivityType.objectUniversalIdentifier
            });
            if ((0, _utils.isDefined)(flatObjectMetadata)) {
                eligibleNonAuditedObjectMetadataIds.add(flatObjectMetadata.id);
            }
        }
        return {
            activeTimelineActivityTypes,
            throughRules,
            eligibleNonAuditedObjectMetadataIds,
            flatFieldMetadataMaps,
            resolveTimelineActivityType
        };
    }
    constructor(workspaceManyOrAllFlatEntityMapsCacheService){
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.routingPlanByWorkspaceId = new Map();
    }
};
TimelineActivityRoutingPlanService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], TimelineActivityRoutingPlanService);

//# sourceMappingURL=timeline-activity-routing-plan.service.js.map