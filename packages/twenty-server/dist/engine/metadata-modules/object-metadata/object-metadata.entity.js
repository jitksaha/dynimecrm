"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectMetadataEntity", {
    enumerable: true,
    get: function() {
        return ObjectMetadataEntity;
    }
});
const _typeorm = require("typeorm");
const _types = require("twenty-shared/types");
const _addmetadataoverridescolumnupgradecommandnameconstant = require("../../../database/commands/upgrade-version-command/2-19/add-metadata-overrides-column-upgrade-command-name.constant");
const _addmetadatawritabilityupgradecommandnameconstant = require("../../../database/commands/upgrade-version-command/2-32/add-metadata-writability-upgrade-command-name.constant");
const _addobjectmetadataopenrecordinupgradecommandnameconstant = require("../../../database/commands/upgrade-version-command/2-27/add-object-metadata-open-record-in-upgrade-command-name.constant");
const _dropmetadatastandardoverridescolumnupgradecommandnameconstant = require("../../../database/commands/upgrade-version-command/2-20/drop-metadata-standard-overrides-column-upgrade-command-name.constant");
const _wasintroducedinupgradedecorator = require("../../core-modules/upgrade/decorators/was-introduced-in-upgrade.decorator");
const _wasremovedinupgradedecorator = require("../../core-modules/upgrade/decorators/was-removed-in-upgrade.decorator");
const _commandmenuitementity = require("../command-menu-item/entities/command-menu-item.entity");
const _fieldmetadataentity = require("../field-metadata/field-metadata.entity");
const _indexmetadataentity = require("../index-metadata/index-metadata.entity");
const _renameisuireadonlytoisuieditableupgradecommandnameconstant = require("./constants/rename-is-ui-read-only-to-is-ui-editable-upgrade-command-name.constant");
const _fieldpermissionentity = require("../object-permission/field-permission/field-permission.entity");
const _objectpermissionentity = require("../object-permission/object-permission.entity");
const _pagelayoutentity = require("../page-layout/entities/page-layout.entity");
const _searchfieldmetadataentity = require("../search-field-metadata/search-field-metadata.entity");
const _viewentity = require("../view/entities/view.entity");
const _syncableentityinterface = require("../../workspace-manager/types/syncable-entity.interface");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ObjectMetadataEntity = class ObjectMetadataEntity extends _syncableentityinterface.SyncableEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], ObjectMetadataEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], ObjectMetadataEntity.prototype, "dataSourceId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ObjectMetadataEntity.prototype, "nameSingular", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ObjectMetadataEntity.prototype, "namePlural", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ObjectMetadataEntity.prototype, "labelSingular", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ObjectMetadataEntity.prototype, "labelPlural", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'text'
    }),
    _ts_metadata("design:type", Object)
], ObjectMetadataEntity.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'varchar'
    }),
    _ts_metadata("design:type", Object)
], ObjectMetadataEntity.prototype, "icon", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'text'
    }),
    _ts_metadata("design:type", Object)
], ObjectMetadataEntity.prototype, "color", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addobjectmetadataopenrecordinupgradecommandnameconstant.ADD_OBJECT_METADATA_OPEN_RECORD_IN_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        type: 'enum',
        enum: Object.values(_types.ObjectOpenRecordIn),
        default: _types.ObjectOpenRecordIn.USER_CHOICE
    }),
    _ts_metadata("design:type", typeof _types.ObjectOpenRecordIn === "undefined" ? Object : _types.ObjectOpenRecordIn)
], ObjectMetadataEntity.prototype, "openRecordIn", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addmetadataoverridescolumnupgradecommandnameconstant.ADD_METADATA_OVERRIDES_COLUMN_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ObjectMetadataEntity.prototype, "overrides", void 0);
_ts_decorate([
    (0, _wasremovedinupgradedecorator.WasRemovedInUpgrade)({
        upgradeCommandName: _dropmetadatastandardoverridescolumnupgradecommandnameconstant.DROP_METADATA_STANDARD_OVERRIDES_COLUMN_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", typeof _wasremovedinupgradedecorator.WasRemovedInUpgrade === "undefined" ? Object : _wasremovedinupgradedecorator.WasRemovedInUpgrade)
], ObjectMetadataEntity.prototype, "standardOverrides", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ObjectMetadataEntity.prototype, "targetTableName", void 0);
_ts_decorate([
    (0, _wasremovedinupgradedecorator.WasRemovedInUpgrade)({
        upgradeCommandName: '2.12.0_DropIsCustomFromObjectAndFieldMetadataFastInstanceCommand_1780579070012'
    }),
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", typeof _wasremovedinupgradedecorator.WasRemovedInUpgrade === "undefined" ? Object : _wasremovedinupgradedecorator.WasRemovedInUpgrade)
], ObjectMetadataEntity.prototype, "isCustom", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataEntity.prototype, "isRemote", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataEntity.prototype, "isActive", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataEntity.prototype, "isSystem", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _renameisuireadonlytoisuieditableupgradecommandnameconstant.RENAME_IS_UI_READ_ONLY_TO_IS_UI_EDITABLE_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataEntity.prototype, "isUIEditable", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", typeof _wasremovedinupgradedecorator.WasRemovedInUpgrade === "undefined" ? Object : _wasremovedinupgradedecorator.WasRemovedInUpgrade)
], ObjectMetadataEntity.prototype, "isUIReadOnly", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _renameisuireadonlytoisuieditableupgradecommandnameconstant.RENAME_IS_UI_READ_ONLY_TO_IS_UI_EDITABLE_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataEntity.prototype, "isUICreatable", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addmetadatawritabilityupgradecommandnameconstant.ADD_METADATA_WRITABILITY_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        type: 'enum',
        enum: Object.values(_types.MetadataWritability),
        default: _types.MetadataWritability.OPEN
    }),
    _ts_metadata("design:type", typeof _types.MetadataWritability === "undefined" ? Object : _types.MetadataWritability)
], ObjectMetadataEntity.prototype, "writability", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataEntity.prototype, "isAuditLogged", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataEntity.prototype, "isSearchable", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ObjectMetadataEntity.prototype, "duplicateCriteria", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'varchar'
    }),
    _ts_metadata("design:type", Object)
], ObjectMetadataEntity.prototype, "shortcut", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], ObjectMetadataEntity.prototype, "labelIdentifierFieldMetadataId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", Object)
], ObjectMetadataEntity.prototype, "imageIdentifierFieldMetadataId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], ObjectMetadataEntity.prototype, "isLabelSyncedWithName", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_fieldmetadataentity.FieldMetadataEntity, (field)=>field.object, {
        cascade: true
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], ObjectMetadataEntity.prototype, "fields", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_indexmetadataentity.IndexMetadataEntity, (index)=>index.objectMetadata, {
        cascade: true
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], ObjectMetadataEntity.prototype, "indexMetadatas", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_searchfieldmetadataentity.SearchFieldMetadataEntity, (searchFieldMetadata)=>searchFieldMetadata.objectMetadata, {
        cascade: true
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], ObjectMetadataEntity.prototype, "searchFieldMetadatas", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ObjectMetadataEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ObjectMetadataEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_objectpermissionentity.ObjectPermissionEntity, (objectPermission)=>objectPermission.objectMetadata, {
        cascade: true
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], ObjectMetadataEntity.prototype, "objectPermissions", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_fieldpermissionentity.FieldPermissionEntity, (fieldPermission)=>fieldPermission.objectMetadata, {
        cascade: true
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], ObjectMetadataEntity.prototype, "fieldPermissions", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_viewentity.ViewEntity, (view)=>view.objectMetadata, {
        cascade: true
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], ObjectMetadataEntity.prototype, "views", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_pagelayoutentity.PageLayoutEntity, (pageLayout)=>pageLayout.objectMetadata, {
        cascade: true
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], ObjectMetadataEntity.prototype, "pageLayouts", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_commandmenuitementity.CommandMenuItemEntity, (commandMenuItem)=>commandMenuItem.navigationTargetObjectMetadata),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], ObjectMetadataEntity.prototype, "commandMenuItems", void 0);
ObjectMetadataEntity = _ts_decorate([
    (0, _typeorm.Entity)('objectMetadata'),
    (0, _typeorm.Unique)('IDX_OBJECT_METADATA_NAME_SINGULAR_WORKSPACE_ID_UNIQUE', [
        'nameSingular',
        'workspaceId'
    ]),
    (0, _typeorm.Unique)('IDX_OBJECT_METADATA_NAME_PLURAL_WORKSPACE_ID_UNIQUE', [
        'namePlural',
        'workspaceId'
    ])
], ObjectMetadataEntity);

//# sourceMappingURL=object-metadata.entity.js.map