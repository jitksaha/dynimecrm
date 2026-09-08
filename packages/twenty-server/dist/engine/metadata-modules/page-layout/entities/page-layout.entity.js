"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PageLayoutEntity", {
    enumerable: true,
    get: function() {
        return PageLayoutEntity;
    }
});
const _graphql = require("@nestjs/graphql");
const _typeorm = require("typeorm");
const _wasintroducedinupgradedecorator = require("../../../core-modules/upgrade/decorators/was-introduced-in-upgrade.decorator");
const _issystemsideeffectupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-15/is-system-side-effect-upgrade-command-name.constant");
const _addpagelayoutisfirsttabpinnedupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-38/add-page-layout-is-first-tab-pinned-upgrade-command-name.constant");
const _objectmetadataentity = require("../../object-metadata/object-metadata.entity");
const _pagelayouttabentity = require("../../page-layout-tab/entities/page-layout-tab.entity");
const _types = require("twenty-shared/types");
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
let PageLayoutEntity = class PageLayoutEntity extends _syncableentityinterface.SyncableEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], PageLayoutEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false
    }),
    _ts_metadata("design:type", String)
], PageLayoutEntity.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: Object.values(_types.PageLayoutType),
        nullable: false,
        default: _types.PageLayoutType.RECORD_PAGE
    }),
    _ts_metadata("design:type", typeof _types.PageLayoutType === "undefined" ? Object : _types.PageLayoutType)
], PageLayoutEntity.prototype, "type", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], PageLayoutEntity.prototype, "objectMetadataId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_objectmetadataentity.ObjectMetadataEntity, {
        onDelete: 'CASCADE',
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'objectMetadataId'
    }),
    _ts_metadata("design:type", Object)
], PageLayoutEntity.prototype, "objectMetadata", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_pagelayouttabentity.PageLayoutTabEntity, (tab)=>tab.pageLayout, {
        cascade: true
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], PageLayoutEntity.prototype, "tabs", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], PageLayoutEntity.prototype, "defaultTabToFocusOnMobileAndSidePanelId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_pagelayouttabentity.PageLayoutTabEntity, {
        onDelete: 'SET NULL',
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'defaultTabToFocusOnMobileAndSidePanelId'
    }),
    _ts_metadata("design:type", Object)
], PageLayoutEntity.prototype, "defaultTabToFocusOnMobileAndSidePanel", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _issystemsideeffectupgradecommandnameconstant.ADD_IS_SYSTEM_SIDE_EFFECT_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: false,
        default: false,
        type: 'boolean'
    }),
    _ts_metadata("design:type", Boolean)
], PageLayoutEntity.prototype, "isSystemSideEffect", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addpagelayoutisfirsttabpinnedupgradecommandnameconstant.ADD_PAGE_LAYOUT_IS_FIRST_TAB_PINNED_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: false,
        default: true,
        type: 'boolean'
    }),
    _ts_metadata("design:type", Boolean)
], PageLayoutEntity.prototype, "isFirstTabPinned", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PageLayoutEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PageLayoutEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.DeleteDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", Object)
], PageLayoutEntity.prototype, "deletedAt", void 0);
PageLayoutEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'pageLayout',
        schema: 'core'
    }),
    (0, _graphql.ObjectType)('PageLayout'),
    (0, _typeorm.Index)('IDX_PAGE_LAYOUT_WORKSPACE_ID_OBJECT_METADATA_ID', [
        'workspaceId',
        'objectMetadataId'
    ], {
        where: '"deletedAt" IS NULL'
    })
], PageLayoutEntity);

//# sourceMappingURL=page-layout.entity.js.map