"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileEntity", {
    enumerable: true,
    get: function() {
        return FileEntity;
    }
});
const _typeorm = require("typeorm");
const _addstatustofileupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-19/add-status-to-file-upgrade-command-name.constant");
const _allowserverscopedfileupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-20/allow-server-scoped-file-upgrade-command-name.constant");
const _filestatustypes = require("../types/file-status.types");
const _wasintroducedinupgradedecorator = require("../../upgrade/decorators/was-introduced-in-upgrade.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FileEntity = class FileEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], FileEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], FileEntity.prototype, "workspaceId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)('WorkspaceEntity', {
        onDelete: 'CASCADE',
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'workspaceId'
    }),
    _ts_metadata("design:type", Object)
], FileEntity.prototype, "workspace", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], FileEntity.prototype, "applicationId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)('ApplicationEntity', {
        onDelete: 'RESTRICT'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'applicationId'
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FileEntity.prototype, "application", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _allowserverscopedfileupgradecommandnameconstant.ALLOW_SERVER_SCOPED_FILE_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], FileEntity.prototype, "applicationRegistrationId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)('ApplicationRegistrationEntity', {
        onDelete: 'CASCADE',
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'applicationRegistrationId'
    }),
    _ts_metadata("design:type", Object)
], FileEntity.prototype, "applicationRegistration", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false
    }),
    _ts_metadata("design:type", String)
], FileEntity.prototype, "path", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'bigint'
    }),
    _ts_metadata("design:type", Number)
], FileEntity.prototype, "size", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], FileEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], FileEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.DeleteDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", Object)
], FileEntity.prototype, "deletedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], FileEntity.prototype, "isStaticAsset", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'jsonb'
    }),
    _ts_metadata("design:type", Object)
], FileEntity.prototype, "settings", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'varchar',
        default: 'application/octet-stream'
    }),
    _ts_metadata("design:type", String)
], FileEntity.prototype, "mimeType", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addstatustofileupgradecommandnameconstant.ADD_STATUS_TO_FILE_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        type: 'enum',
        enum: Object.values(_filestatustypes.FILE_STATUS),
        nullable: false,
        default: _filestatustypes.FILE_STATUS.UPLOADED
    }),
    _ts_metadata("design:type", typeof _filestatustypes.FileStatus === "undefined" ? Object : _filestatustypes.FileStatus)
], FileEntity.prototype, "status", void 0);
FileEntity = _ts_decorate([
    (0, _typeorm.Entity)('file'),
    (0, _typeorm.Check)('CHK_FILE_PENDING_MIME_OCTET_STREAM', `"status" != 'PENDING' OR "mimeType" = 'application/octet-stream'`),
    (0, _typeorm.Check)('CHK_FILE_WORKSPACE_ID_OR_APPLICATION_REGISTRATION_ID', `"workspaceId" IS NOT NULL OR "applicationRegistrationId" IS NOT NULL`),
    (0, _typeorm.Check)('CHK_FILE_WORKSPACE_ID_XOR_APPLICATION_REGISTRATION_ID', `"workspaceId" IS NULL OR "applicationRegistrationId" IS NULL`),
    (0, _typeorm.Index)('IDX_FILE_WORKSPACE_ID', [
        'workspaceId'
    ]),
    (0, _typeorm.Index)('IDX_FILE_STATUS', [
        'status'
    ]),
    (0, _typeorm.Index)('IDX_FILE_APPLICATION_REGISTRATION_ID', [
        'applicationRegistrationId'
    ]),
    (0, _typeorm.Unique)('IDX_APPLICATION_PATH_WORKSPACE_ID_APPLICATION_ID_UNIQUE', [
        'workspaceId',
        'applicationId',
        'path'
    ]),
    (0, _typeorm.Unique)('IDX_FILE_APPLICATION_REGISTRATION_ID_PATH_UNIQUE', [
        'applicationRegistrationId',
        'path'
    ])
], FileEntity);

//# sourceMappingURL=file.entity.js.map