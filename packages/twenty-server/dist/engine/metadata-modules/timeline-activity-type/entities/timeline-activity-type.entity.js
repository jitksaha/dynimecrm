"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityTypeEntity", {
    enumerable: true,
    get: function() {
        return TimelineActivityTypeEntity;
    }
});
const _typeorm = require("typeorm");
const _timelineactivitytypeupgradecommandnameconstants = require("../../../../database/commands/upgrade-version-command/2-34/timeline-activity-type-upgrade-command-name.constants");
const _droptimelineactivitytyperendererupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-35/drop-timeline-activity-type-renderer-upgrade-command-name.constant");
const _timelineactivityhappensatupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-38/timeline-activity-happens-at-upgrade-command-name.constant");
const _wasintroducedinupgradedecorator = require("../../../core-modules/upgrade/decorators/was-introduced-in-upgrade.decorator");
const _wasremovedinupgradedecorator = require("../../../core-modules/upgrade/decorators/was-removed-in-upgrade.decorator");
const _overridableentity = require("../../../workspace-manager/types/overridable-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TimelineActivityTypeEntity = class TimelineActivityTypeEntity extends _overridableentity.OverridableEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], TimelineActivityTypeEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'varchar'
    }),
    _ts_metadata("design:type", String)
], TimelineActivityTypeEntity.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'varchar'
    }),
    _ts_metadata("design:type", String)
], TimelineActivityTypeEntity.prototype, "label", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'varchar'
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEntity.prototype, "action", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'varchar'
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEntity.prototype, "icon", void 0);
_ts_decorate([
    (0, _wasremovedinupgradedecorator.WasRemovedInUpgrade)({
        upgradeCommandName: _droptimelineactivitytyperendererupgradecommandnameconstant.DROP_TIMELINE_ACTIVITY_TYPE_RENDERER_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: true,
        type: 'varchar'
    }),
    _ts_metadata("design:type", typeof _wasremovedinupgradedecorator.WasRemovedInUpgrade === "undefined" ? Object : _wasremovedinupgradedecorator.WasRemovedInUpgrade)
], TimelineActivityTypeEntity.prototype, "renderer", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _timelineactivitytypeupgradecommandnameconstants.REFACTOR_TIMELINE_ACTIVITY_TYPE_RENDERING_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEntity.prototype, "frontComponentUniversalIdentifier", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEntity.prototype, "objectUniversalIdentifier", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_ROUTING_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEntity.prototype, "targetRelationFieldUniversalIdentifier", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_ROUTING_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid',
        array: true
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEntity.prototype, "triggerFieldUniversalIdentifiers", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _timelineactivityhappensatupgradecommandnameconstant.ADD_TIMELINE_ACTIVITY_HAPPENS_AT_FIELD_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEntity.prototype, "happensAtFieldUniversalIdentifier", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _timelineactivitytypeupgradecommandnameconstants.ADD_TIMELINE_ACTIVITY_TYPE_REPLACEMENT_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], TimelineActivityTypeEntity.prototype, "replacesTimelineActivityTypeUniversalIdentifier", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], TimelineActivityTypeEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], TimelineActivityTypeEntity.prototype, "updatedAt", void 0);
TimelineActivityTypeEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'timelineActivityType',
        schema: 'core'
    }),
    (0, _typeorm.Unique)('IDX_TIMELINE_ACTIVITY_TYPE_NAME_APPLICATION_WORKSPACE_UNIQUE', [
        'name',
        'applicationId',
        'workspaceId'
    ]),
    (0, _typeorm.Index)('IDX_TIMELINE_ACTIVITY_TYPE_BASE_EMIT_SLOT_UNIQUE', {
        synchronize: false
    }),
    (0, _typeorm.Index)('IDX_TIMELINE_ACTIVITY_TYPE_OVERRIDE_EMIT_SLOT_UNIQUE', {
        synchronize: false
    })
], TimelineActivityTypeEntity);
(0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
    upgradeCommandName: _timelineactivitytypeupgradecommandnameconstants.TIMELINE_ACTIVITY_TYPE_OVERRIDABLE_ENTITY_UPGRADE_COMMAND_NAME
})(TimelineActivityTypeEntity.prototype, 'overrides');
(0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
    upgradeCommandName: _timelineactivitytypeupgradecommandnameconstants.TIMELINE_ACTIVITY_TYPE_OVERRIDABLE_ENTITY_UPGRADE_COMMAND_NAME
})(TimelineActivityTypeEntity.prototype, 'isActive');

//# sourceMappingURL=timeline-activity-type.entity.js.map