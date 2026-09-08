"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageCalendarTargetReadinessService", {
    enumerable: true,
    get: function() {
        return MessageCalendarTargetReadinessService;
    }
});
const _common = require("@nestjs/common");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _featureflagservice = require("../../feature-flag/services/feature-flag.service");
const _gettargetfieldnameforobjectrecordutil = require("../utils/get-target-field-name-for-object-record.util");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MessageCalendarTargetReadinessService = class MessageCalendarTargetReadinessService {
    async resolveTargetFilter({ objectNameSingular, recordId, workspaceId }) {
        const fieldName = (0, _gettargetfieldnameforobjectrecordutil.getTargetFieldNameForObjectRecord)(objectNameSingular);
        if (!(0, _utils.isDefined)(fieldName) || !await this.isReady(workspaceId)) {
            return undefined;
        }
        return {
            fieldName,
            recordId
        };
    }
    async isReady(workspaceId) {
        const isReadEnabled = await this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_MESSAGE_CALENDAR_TARGET_READ_ENABLED, workspaceId);
        if (!isReadEnabled) {
            return false;
        }
        // A premature flag flip on a workspace whose metadata sync has not run
        // must degrade to legacy reads, not break the timeline relation join.
        const { flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps'
        ]);
        return [
            _metadata.STANDARD_OBJECTS.calendarEventTarget.universalIdentifier,
            _metadata.STANDARD_OBJECTS.messageThreadTarget.universalIdentifier
        ].every((universalIdentifier)=>(0, _utils.isDefined)(flatObjectMetadataMaps.byUniversalIdentifier[universalIdentifier]));
    }
    constructor(featureFlagService, workspaceCacheService){
        this.featureFlagService = featureFlagService;
        this.workspaceCacheService = workspaceCacheService;
    }
};
MessageCalendarTargetReadinessService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], MessageCalendarTargetReadinessService);

//# sourceMappingURL=message-calendar-target-readiness.service.js.map