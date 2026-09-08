"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageSuppressionEntity", {
    enumerable: true,
    get: function() {
        return MessageSuppressionEntity;
    }
});
const _typeorm = require("typeorm");
const _messagesuppressionreasontype = require("./types/message-suppression-reason.type");
const _messagesuppressionsourcetype = require("./types/message-suppression-source.type");
const _workspacerelatedentity = require("../../workspace-manager/types/workspace-related-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MessageSuppressionEntity = class MessageSuppressionEntity extends _workspacerelatedentity.WorkspaceRelatedEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], MessageSuppressionEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], MessageSuppressionEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], MessageSuppressionEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: false
    }),
    _ts_metadata("design:type", String)
], MessageSuppressionEntity.prototype, "emailAddress", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: Object.values(_messagesuppressionreasontype.MessageSuppressionReason),
        nullable: false
    }),
    _ts_metadata("design:type", typeof _messagesuppressionreasontype.MessageSuppressionReason === "undefined" ? Object : _messagesuppressionreasontype.MessageSuppressionReason)
], MessageSuppressionEntity.prototype, "reason", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: Object.values(_messagesuppressionsourcetype.MessageSuppressionSource),
        nullable: false
    }),
    _ts_metadata("design:type", typeof _messagesuppressionsourcetype.MessageSuppressionSource === "undefined" ? Object : _messagesuppressionsourcetype.MessageSuppressionSource)
], MessageSuppressionEntity.prototype, "source", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], MessageSuppressionEntity.prototype, "providerEventId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], MessageSuppressionEntity.prototype, "unsubscribeTopicId", void 0);
MessageSuppressionEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'messageSuppression',
        schema: 'core'
    }),
    (0, _typeorm.Index)('IDX_MESSAGE_SUPPRESSION_GLOBAL_UNIQUE', [
        'workspaceId',
        'emailAddress'
    ], {
        unique: true,
        where: '"unsubscribeTopicId" IS NULL'
    }),
    (0, _typeorm.Index)('IDX_MESSAGE_SUPPRESSION_TOPIC_UNIQUE', [
        'workspaceId',
        'emailAddress',
        'unsubscribeTopicId'
    ], {
        unique: true,
        where: '"unsubscribeTopicId" IS NOT NULL'
    }),
    (0, _typeorm.Index)('IDX_MESSAGE_SUPPRESSION_WORKSPACE_ID', [
        'workspaceId'
    ])
], MessageSuppressionEntity);

//# sourceMappingURL=message-suppression.entity.js.map