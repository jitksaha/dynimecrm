"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get TimelineActivityTypeEmitDTO () {
        return TimelineActivityTypeEmitDTO;
    },
    get TimelineActivityTypeEmitThroughDTO () {
        return TimelineActivityTypeEmitThroughDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TimelineActivityTypeEmitThroughDTO = class TimelineActivityTypeEmitThroughDTO {
};
_ts_decorate([
    (0, _classvalidator.IsUUID)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], TimelineActivityTypeEmitThroughDTO.prototype, "relationFieldUniversalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>[
            _scalars.UUIDScalarType
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEmitThroughDTO.prototype, "triggerFieldUniversalIdentifiers", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUUID)(),
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEmitThroughDTO.prototype, "happensAtFieldUniversalIdentifier", void 0);
TimelineActivityTypeEmitThroughDTO = _ts_decorate([
    (0, _graphql.ObjectType)('TimelineActivityTypeEmitThrough')
], TimelineActivityTypeEmitThroughDTO);
let TimelineActivityTypeEmitDTO = class TimelineActivityTypeEmitDTO {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", typeof TimelineActivityAction === "undefined" ? Object : TimelineActivityAction)
], TimelineActivityTypeEmitDTO.prototype, "on", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUUID)(),
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEmitDTO.prototype, "objectUniversalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>TimelineActivityTypeEmitThroughDTO, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEmitDTO.prototype, "through", void 0);
TimelineActivityTypeEmitDTO = _ts_decorate([
    (0, _graphql.ObjectType)('TimelineActivityTypeEmit')
], TimelineActivityTypeEmitDTO);

//# sourceMappingURL=timeline-activity-type-emit.dto.js.map