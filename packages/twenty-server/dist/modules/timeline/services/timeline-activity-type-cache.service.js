"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityTypeCacheService", {
    enumerable: true,
    get: function() {
        return TimelineActivityTypeCacheService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _workspacemanyorallflatentitymapscacheservice = require("../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsutil = require("../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _timelineexception = require("../exceptions/timeline.exception");
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
let TimelineActivityTypeCacheService = class TimelineActivityTypeCacheService {
    async getTimelineActivityTypeResolver(workspaceId) {
        const { flatTimelineActivityTypeMaps, flatObjectMetadataMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatTimelineActivityTypeMaps',
                'flatObjectMetadataMaps'
            ]
        });
        const { resolveTimelineActivityType } = (0, _resolvetimelineactivitytypeutil.buildTimelineActivityTypeResolution)({
            ...flatTimelineActivityTypeMaps,
            objectMetadataByUniversalIdentifier: flatObjectMetadataMaps.byUniversalIdentifier
        });
        return resolveTimelineActivityType;
    }
    async getTimelineActivityTypeByIdOrThrow({ workspaceId, timelineActivityTypeId }) {
        const { flatTimelineActivityTypeMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatTimelineActivityTypeMaps'
            ]
        });
        const timelineActivityType = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: timelineActivityTypeId,
            flatEntityMaps: flatTimelineActivityTypeMaps
        });
        if (!(0, _utils.isDefined)(timelineActivityType) || !timelineActivityType.isActive) {
            throw new _timelineexception.TimelineException(`Active timeline activity type ${timelineActivityTypeId} was not found in workspace ${workspaceId}`);
        }
        return (0, _resolvetimelineactivitytypeutil.toResolvedTimelineActivityType)(timelineActivityType);
    }
    constructor(workspaceManyOrAllFlatEntityMapsCacheService){
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
    }
};
TimelineActivityTypeCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], TimelineActivityTypeCacheService);

//# sourceMappingURL=timeline-activity-type-cache.service.js.map