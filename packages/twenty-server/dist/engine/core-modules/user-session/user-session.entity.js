"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserSessionEntity", {
    enumerable: true,
    get: function() {
        return UserSessionEntity;
    }
});
const _typeorm = require("typeorm");
const _userentity = require("../user/user.entity");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _workspaceentity = require("../workspace/workspace.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UserSessionEntity = class UserSessionEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], UserSessionEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Index)('IDX_USER_SESSION_TOKEN_HASH_UNIQUE', {
        unique: true
    }),
    (0, _typeorm.Column)({
        type: 'text'
    }),
    _ts_metadata("design:type", String)
], UserSessionEntity.prototype, "tokenHash", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.UserEntity, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'userId',
        foreignKeyConstraintName: 'FK_USER_SESSION_USER_ID'
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], UserSessionEntity.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.Index)('IDX_USER_SESSION_USER_ID'),
    (0, _typeorm.Column)({
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], UserSessionEntity.prototype, "userId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_workspaceentity.WorkspaceEntity, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'workspaceId',
        foreignKeyConstraintName: 'FK_USER_SESSION_WORKSPACE_ID'
    }),
    _ts_metadata("design:type", Object)
], UserSessionEntity.prototype, "workspace", void 0);
_ts_decorate([
    (0, _typeorm.Index)('IDX_USER_SESSION_WORKSPACE_ID'),
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UserSessionEntity.prototype, "workspaceId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userworkspaceentity.UserWorkspaceEntity, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'userWorkspaceId',
        foreignKeyConstraintName: 'FK_USER_SESSION_USER_WORKSPACE_ID'
    }),
    _ts_metadata("design:type", Object)
], UserSessionEntity.prototype, "userWorkspace", void 0);
_ts_decorate([
    (0, _typeorm.Index)('IDX_USER_SESSION_USER_WORKSPACE_ID'),
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UserSessionEntity.prototype, "userWorkspaceId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text'
    }),
    _ts_metadata("design:type", typeof AuthProviderEnum === "undefined" ? Object : AuthProviderEnum)
], UserSessionEntity.prototype, "authProvider", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], UserSessionEntity.prototype, "isImpersonating", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UserSessionEntity.prototype, "impersonatorUserWorkspaceId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UserSessionEntity.prototype, "impersonatedUserWorkspaceId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UserSessionEntity.prototype, "userAgent", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UserSessionEntity.prototype, "ipAddress", void 0);
_ts_decorate([
    (0, _typeorm.Index)('IDX_USER_SESSION_EXPIRES_AT'),
    (0, _typeorm.Column)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserSessionEntity.prototype, "expiresAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserSessionEntity.prototype, "lastActiveAt", void 0);
_ts_decorate([
    (0, _typeorm.Index)('IDX_USER_SESSION_REVOKED_AT'),
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UserSessionEntity.prototype, "revokedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], UserSessionEntity.prototype, "revokedReason", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserSessionEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserSessionEntity.prototype, "updatedAt", void 0);
UserSessionEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'userSession',
        schema: 'core'
    })
], UserSessionEntity);

//# sourceMappingURL=user-session.entity.js.map