"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UnsubscribeTopicDTO", {
    enumerable: true,
    get: function() {
        return UnsubscribeTopicDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _unsubscribetopicvisibilitytype = require("../types/unsubscribe-topic-visibility.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
(0, _graphql.registerEnumType)(_unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility, {
    name: 'UnsubscribeTopicVisibility'
});
let UnsubscribeTopicDTO = class UnsubscribeTopicDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], UnsubscribeTopicDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UnsubscribeTopicDTO.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UnsubscribeTopicDTO.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UnsubscribeTopicDTO.prototype, "name", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UnsubscribeTopicDTO.prototype, "description", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility),
    _ts_metadata("design:type", typeof _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility === "undefined" ? Object : _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility)
], UnsubscribeTopicDTO.prototype, "visibility", void 0);
UnsubscribeTopicDTO = _ts_decorate([
    (0, _graphql.ObjectType)('UnsubscribeTopic')
], UnsubscribeTopicDTO);

//# sourceMappingURL=unsubscribe-topic.dto.js.map