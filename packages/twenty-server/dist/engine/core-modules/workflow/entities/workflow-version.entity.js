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
    get WorkflowVersionEntity () {
        return WorkflowVersionEntity;
    },
    get WorkflowVersionStatus () {
        return WorkflowVersionStatus;
    }
});
const _typeorm = require("typeorm");
const _createworkflowversioncoretableupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-20/create-workflow-version-core-table-upgrade-command-name.constant");
const _wasintroducedinupgradedecorator = require("../../upgrade/decorators/was-introduced-in-upgrade.decorator");
const _syncableentityinterface = require("../../../workspace-manager/types/syncable-entity.interface");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var WorkflowVersionStatus = /*#__PURE__*/ function(WorkflowVersionStatus) {
    WorkflowVersionStatus["DRAFT"] = "DRAFT";
    WorkflowVersionStatus["ACTIVE"] = "ACTIVE";
    WorkflowVersionStatus["DEACTIVATED"] = "DEACTIVATED";
    WorkflowVersionStatus["ARCHIVED"] = "ARCHIVED";
    return WorkflowVersionStatus;
}({});
let WorkflowVersionEntity = class WorkflowVersionEntity extends _syncableentityinterface.SyncableEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], WorkflowVersionEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], WorkflowVersionEntity.prototype, "triggers", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], WorkflowVersionEntity.prototype, "steps", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: WorkflowVersionStatus,
        default: "DRAFT",
        nullable: false
    }),
    _ts_metadata("design:type", String)
], WorkflowVersionEntity.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: false
    }),
    _ts_metadata("design:type", String)
], WorkflowVersionEntity.prototype, "workflowId", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], WorkflowVersionEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], WorkflowVersionEntity.prototype, "updatedAt", void 0);
WorkflowVersionEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'workflowVersion',
        schema: 'core'
    }),
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _createworkflowversioncoretableupgradecommandnameconstant.CREATE_WORKFLOW_VERSION_CORE_TABLE_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Index)('IDX_WORKFLOW_VERSION_WORKSPACE_ID', [
        'workspaceId'
    ]),
    (0, _typeorm.Index)('IDX_WORKFLOW_VERSION_ONE_ACTIVE_PER_WORKFLOW', [
        'workspaceId',
        'workflowId'
    ], {
        unique: true,
        where: `"status" = 'ACTIVE'`
    }),
    (0, _typeorm.Index)('IDX_WORKFLOW_VERSION_APPLICATION_ID', [
        'applicationId'
    ])
], WorkflowVersionEntity);

//# sourceMappingURL=workflow-version.entity.js.map