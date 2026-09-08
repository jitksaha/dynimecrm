"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FindMessageSuppressionsInput", {
    enumerable: true,
    get: function() {
        return FindMessageSuppressionsInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _messagesuppressionreasontype = require("../types/message-suppression-reason.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FindMessageSuppressionsInput = class FindMessageSuppressionsInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_messagesuppressionreasontype.MessageSuppressionReason, {
        nullable: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_messagesuppressionreasontype.MessageSuppressionReason),
    _ts_metadata("design:type", typeof _messagesuppressionreasontype.MessageSuppressionReason === "undefined" ? Object : _messagesuppressionreasontype.MessageSuppressionReason)
], FindMessageSuppressionsInput.prototype, "reason", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindMessageSuppressionsInput.prototype, "searchTerm", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType, {
        nullable: true
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUUID)('4'),
    _ts_metadata("design:type", String)
], FindMessageSuppressionsInput.prototype, "unsubscribeTopicId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int, {
        defaultValue: 30
    }),
    (0, _classvalidator.Min)(1),
    (0, _classvalidator.Max)(100),
    _ts_metadata("design:type", Number)
], FindMessageSuppressionsInput.prototype, "limit", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int, {
        defaultValue: 0
    }),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], FindMessageSuppressionsInput.prototype, "offset", void 0);
FindMessageSuppressionsInput = _ts_decorate([
    (0, _graphql.InputType)()
], FindMessageSuppressionsInput);

//# sourceMappingURL=find-message-suppressions.input.js.map