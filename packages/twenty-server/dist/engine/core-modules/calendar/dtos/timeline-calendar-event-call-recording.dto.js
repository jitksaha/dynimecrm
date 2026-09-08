"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineCalendarEventCallRecordingDTO", {
    enumerable: true,
    get: function() {
        return TimelineCalendarEventCallRecordingDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _callrecordingstatusenum = require("../../../../modules/call-recording/common/enums/call-recording-status.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
(0, _graphql.registerEnumType)(_callrecordingstatusenum.CallRecordingStatus, {
    name: 'CallRecordingStatus',
    description: 'Recording lifecycle status'
});
let TimelineCalendarEventCallRecordingDTO = class TimelineCalendarEventCallRecordingDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], TimelineCalendarEventCallRecordingDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_callrecordingstatusenum.CallRecordingStatus),
    _ts_metadata("design:type", typeof _callrecordingstatusenum.CallRecordingStatus === "undefined" ? Object : _callrecordingstatusenum.CallRecordingStatus)
], TimelineCalendarEventCallRecordingDTO.prototype, "status", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], TimelineCalendarEventCallRecordingDTO.prototype, "applicationId", void 0);
TimelineCalendarEventCallRecordingDTO = _ts_decorate([
    (0, _graphql.ObjectType)('TimelineCalendarEventCallRecording')
], TimelineCalendarEventCallRecordingDTO);

//# sourceMappingURL=timeline-calendar-event-call-recording.dto.js.map