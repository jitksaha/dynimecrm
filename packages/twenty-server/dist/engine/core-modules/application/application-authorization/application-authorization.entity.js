"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationAuthorizationEntity", {
    enumerable: true,
    get: function() {
        return ApplicationAuthorizationEntity;
    }
});
const _typeorm = require("typeorm");
const _applicationentity = require("../application.entity");
const _userworkspaceentity = require("../../user-workspace/user-workspace.entity");
const _userentity = require("../../user/user.entity");
const _workspaceentity = require("../../workspace/workspace.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ApplicationAuthorizationEntity = class ApplicationAuthorizationEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], ApplicationAuthorizationEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.UserEntity, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'userId',
        foreignKeyConstraintName: 'FK_APPLICATION_AUTHORIZATION_USER_ID'
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], ApplicationAuthorizationEntity.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], ApplicationAuthorizationEntity.prototype, "userId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_workspaceentity.WorkspaceEntity, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'workspaceId',
        foreignKeyConstraintName: 'FK_APPLICATION_AUTHORIZATION_WORKSPACE_ID'
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], ApplicationAuthorizationEntity.prototype, "workspace", void 0);
_ts_decorate([
    (0, _typeorm.Index)('IDX_APPLICATION_AUTHORIZATION_WORKSPACE_ID'),
    (0, _typeorm.Column)({
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], ApplicationAuthorizationEntity.prototype, "workspaceId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_applicationentity.ApplicationEntity, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'applicationId',
        foreignKeyConstraintName: 'FK_APPLICATION_AUTHORIZATION_APPLICATION_ID'
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], ApplicationAuthorizationEntity.prototype, "application", void 0);
_ts_decorate([
    (0, _typeorm.Index)('IDX_APPLICATION_AUTHORIZATION_APPLICATION_ID'),
    (0, _typeorm.Column)({
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], ApplicationAuthorizationEntity.prototype, "applicationId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userworkspaceentity.UserWorkspaceEntity, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'userWorkspaceId',
        foreignKeyConstraintName: 'FK_APPLICATION_AUTHORIZATION_USER_WORKSPACE_ID'
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], ApplicationAuthorizationEntity.prototype, "userWorkspace", void 0);
_ts_decorate([
    (0, _typeorm.Index)('IDX_APPLICATION_AUTHORIZATION_USER_WORKSPACE_ID'),
    (0, _typeorm.Column)({
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], ApplicationAuthorizationEntity.prototype, "userWorkspaceId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        array: true,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ApplicationAuthorizationEntity.prototype, "scopes", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ApplicationAuthorizationEntity.prototype, "lastAuthorizedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ApplicationAuthorizationEntity.prototype, "lastUsedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ApplicationAuthorizationEntity.prototype, "revokedAt", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ApplicationAuthorizationEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ApplicationAuthorizationEntity.prototype, "updatedAt", void 0);
ApplicationAuthorizationEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'applicationAuthorization',
        schema: 'core'
    }),
    (0, _typeorm.Index)('IDX_APPLICATION_AUTHORIZATION_USER_APPLICATION_UNIQUE', [
        'userId',
        'applicationId'
    ], {
        unique: true
    })
], ApplicationAuthorizationEntity);

//# sourceMappingURL=application-authorization.entity.js.map