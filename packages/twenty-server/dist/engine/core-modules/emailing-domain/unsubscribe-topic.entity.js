"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UnsubscribeTopicEntity", {
    enumerable: true,
    get: function() {
        return UnsubscribeTopicEntity;
    }
});
const _typeorm = require("typeorm");
const _unsubscribetopicvisibilitytype = require("./types/unsubscribe-topic-visibility.type");
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
let UnsubscribeTopicEntity = class UnsubscribeTopicEntity extends _workspacerelatedentity.WorkspaceRelatedEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], UnsubscribeTopicEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UnsubscribeTopicEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UnsubscribeTopicEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UnsubscribeTopicEntity.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UnsubscribeTopicEntity.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: Object.values(_unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility),
        default: _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility.PRIVATE,
        nullable: false
    }),
    _ts_metadata("design:type", typeof _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility === "undefined" ? Object : _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility)
], UnsubscribeTopicEntity.prototype, "visibility", void 0);
UnsubscribeTopicEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'unsubscribeTopic',
        schema: 'core'
    }),
    (0, _typeorm.Index)('IDX_UNSUBSCRIBE_TOPIC_WORKSPACE_ID', [
        'workspaceId'
    ])
], UnsubscribeTopicEntity);

//# sourceMappingURL=unsubscribe-topic.entity.js.map