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
    get MessageSuppressionDTO () {
        return MessageSuppressionDTO;
    },
    get MessageSuppressionListDTO () {
        return MessageSuppressionListDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _messagesuppressionreasontype = require("../types/message-suppression-reason.type");
const _messagesuppressionsourcetype = require("../types/message-suppression-source.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
(0, _graphql.registerEnumType)(_messagesuppressionreasontype.MessageSuppressionReason, {
    name: 'MessageSuppressionReason'
});
(0, _graphql.registerEnumType)(_messagesuppressionsourcetype.MessageSuppressionSource, {
    name: 'MessageSuppressionSource'
});
let MessageSuppressionDTO = class MessageSuppressionDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], MessageSuppressionDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], MessageSuppressionDTO.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], MessageSuppressionDTO.prototype, "emailAddress", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_messagesuppressionreasontype.MessageSuppressionReason),
    _ts_metadata("design:type", typeof _messagesuppressionreasontype.MessageSuppressionReason === "undefined" ? Object : _messagesuppressionreasontype.MessageSuppressionReason)
], MessageSuppressionDTO.prototype, "reason", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_messagesuppressionsourcetype.MessageSuppressionSource),
    _ts_metadata("design:type", typeof _messagesuppressionsourcetype.MessageSuppressionSource === "undefined" ? Object : _messagesuppressionsourcetype.MessageSuppressionSource)
], MessageSuppressionDTO.prototype, "source", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], MessageSuppressionDTO.prototype, "unsubscribeTopicId", void 0);
MessageSuppressionDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MessageSuppression')
], MessageSuppressionDTO);
let MessageSuppressionListDTO = class MessageSuppressionListDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>[
            MessageSuppressionDTO
        ]),
    _ts_metadata("design:type", Array)
], MessageSuppressionListDTO.prototype, "records", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], MessageSuppressionListDTO.prototype, "totalCount", void 0);
MessageSuppressionListDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MessageSuppressionList')
], MessageSuppressionListDTO);

//# sourceMappingURL=message-suppression.dto.js.map