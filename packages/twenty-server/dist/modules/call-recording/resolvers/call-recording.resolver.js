"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CallRecordingResolver", {
    enumerable: true,
    get: function() {
        return CallRecordingResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _metadataresolverdecorator = require("../../../engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _scalars = require("../../../engine/api/graphql/workspace-schema-builder/graphql-types/scalars");
const _resolvervalidationpipe = require("../../../engine/core-modules/graphql/pipes/resolver-validation.pipe");
const _nopermissionguard = require("../../../engine/guards/no-permission.guard");
const _workspaceauthguard = require("../../../engine/guards/workspace-auth.guard");
const _callrecordingservice = require("../services/call-recording.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let CallRecordingResolver = class CallRecordingResolver {
    async callRecordingIdForCalendarEvent(calendarEventId) {
        return this.callRecordingService.findCallRecordingIdForCalendarEvent(calendarEventId);
    }
    constructor(callRecordingService){
        this.callRecordingService = callRecordingService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)('calendarEventId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], CallRecordingResolver.prototype, "callRecordingIdForCalendarEvent", null);
CallRecordingResolver = _ts_decorate([
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _callrecordingservice.CallRecordingService === "undefined" ? Object : _callrecordingservice.CallRecordingService
    ])
], CallRecordingResolver);

//# sourceMappingURL=call-recording.resolver.js.map