"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldMetadataEntity", {
    enumerable: true,
    get: function() {
        return FieldMetadataEntity;
    }
});
const _types = require("twenty-shared/types");
const _typeorm = require("typeorm");
const _issystemsideeffectupgradecommandnameconstant = require("../../../database/commands/upgrade-version-command/2-15/is-system-side-effect-upgrade-command-name.constant");
const _addmetadataoverridescolumnupgradecommandnameconstant = require("../../../database/commands/upgrade-version-command/2-19/add-metadata-overrides-column-upgrade-command-name.constant");
const _addmetadatawritabilityupgradecommandnameconstant = require("../../../database/commands/upgrade-version-command/2-32/add-metadata-writability-upgrade-command-name.constant");
const _dropmetadatastandardoverridescolumnupgradecommandnameconstant = require("../../../database/commands/upgrade-version-command/2-20/drop-metadata-standard-overrides-column-upgrade-command-name.constant");
const _wasintroducedinupgradedecorator = require("../../core-modules/upgrade/decorators/was-introduced-in-upgrade.decorator");
const _wasremovedinupgradedecorator = require("../../core-modules/upgrade/decorators/was-removed-in-upgrade.decorator");
const _assignifisgivenfieldmetadatatypetype = require("./types/assign-if-is-given-field-metadata-type.type");
const _assigntypeifismorphorrelationfieldmetadatatypetype = require("./types/assign-type-if-is-morph-or-relation-field-metadata-type.type");
const _indexfieldmetadataentity = require("../index-metadata/index-field-metadata.entity");
const _renameisuireadonlytoisuieditableupgradecommandnameconstant = require("../object-metadata/constants/rename-is-ui-read-only-to-is-ui-editable-upgrade-command-name.constant");
const _objectmetadataentity = require("../object-metadata/object-metadata.entity");
const _fieldpermissionentity = require("../object-permission/field-permission/field-permission.entity");
const _searchfieldmetadataentity = require("../search-field-metadata/search-field-metadata.entity");
const _viewfieldentity = require("../view-field/entities/view-field.entity");
const _viewfilterentity = require("../view-filter/entities/view-filter.entity");
const _viewsortentity = require("../view-sort/entities/view-sort.entity");
const _viewentity = require("../view/entities/view.entity");
const _syncableentityinterface = require("../../workspace-manager/types/syncable-entity.interface");
const _jsonbpropertytype = require("../../workspace-manager/workspace-migration/universal-flat-entity/types/jsonb-property.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FieldMetadataEntity = class FieldMetadataEntity extends _syncableentityinterface.SyncableEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], FieldMetadataEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], FieldMetadataEntity.prototype, "objectMetadataId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_objectmetadataentity.ObjectMetadataEntity, (object)=>object.fields, {
        onDelete: 'CASCADE',
        nullable: false
    }),
    (0, _typeorm.JoinColumn)({
        name: 'objectMetadataId'
    }),
    (0, _typeorm.Index)('IDX_FIELD_METADATA_OBJECT_METADATA_ID', [
        'objectMetadataId'
    ]),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FieldMetadataEntity.prototype, "object", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'varchar'
    }),
    _ts_metadata("design:type", typeof TFieldMetadataType === "undefined" ? Object : TFieldMetadataType)
], FieldMetadataEntity.prototype, "type", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false
    }),
    _ts_metadata("design:type", String)
], FieldMetadataEntity.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false
    }),
    _ts_metadata("design:type", String)
], FieldMetadataEntity.prototype, "label", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'jsonb'
    }),
    _ts_metadata("design:type", typeof _jsonbpropertytype.JsonbProperty === "undefined" ? Object : _jsonbpropertytype.JsonbProperty)
], FieldMetadataEntity.prototype, "defaultValue", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'text'
    }),
    _ts_metadata("design:type", Object)
], FieldMetadataEntity.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'varchar'
    }),
    _ts_metadata("design:type", Object)
], FieldMetadataEntity.prototype, "icon", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addmetadataoverridescolumnupgradecommandnameconstant.ADD_METADATA_OVERRIDES_COLUMN_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], FieldMetadataEntity.prototype, "overrides", void 0);
_ts_decorate([
    (0, _wasremovedinupgradedecorator.WasRemovedInUpgrade)({
        upgradeCommandName: _dropmetadatastandardoverridescolumnupgradecommandnameconstant.DROP_METADATA_STANDARD_OVERRIDES_COLUMN_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", typeof _wasremovedinupgradedecorator.WasRemovedInUpgrade === "undefined" ? Object : _wasremovedinupgradedecorator.WasRemovedInUpgrade)
], FieldMetadataEntity.prototype, "standardOverrides", void 0);
_ts_decorate([
    (0, _typeorm.Column)('jsonb', {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _jsonbpropertytype.JsonbProperty === "undefined" ? Object : _jsonbpropertytype.JsonbProperty)
], FieldMetadataEntity.prototype, "options", void 0);
_ts_decorate([
    (0, _typeorm.Column)('jsonb', {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _jsonbpropertytype.JsonbProperty === "undefined" ? Object : _jsonbpropertytype.JsonbProperty)
], FieldMetadataEntity.prototype, "settings", void 0);
_ts_decorate([
    (0, _wasremovedinupgradedecorator.WasRemovedInUpgrade)({
        upgradeCommandName: '2.12.0_DropIsCustomFromObjectAndFieldMetadataFastInstanceCommand_1780579070012'
    }),
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", typeof _wasremovedinupgradedecorator.WasRemovedInUpgrade === "undefined" ? Object : _wasremovedinupgradedecorator.WasRemovedInUpgrade)
], FieldMetadataEntity.prototype, "isCustom", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], FieldMetadataEntity.prototype, "isActive", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], FieldMetadataEntity.prototype, "isSystem", void 0);
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
], FieldMetadataEntity.prototype, "isSystemSideEffect", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _renameisuireadonlytoisuieditableupgradecommandnameconstant.RENAME_IS_UI_READ_ONLY_TO_IS_UI_EDITABLE_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], FieldMetadataEntity.prototype, "isUIEditable", void 0);
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
], FieldMetadataEntity.prototype, "writability", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", typeof _wasremovedinupgradedecorator.WasRemovedInUpgrade === "undefined" ? Object : _wasremovedinupgradedecorator.WasRemovedInUpgrade)
], FieldMetadataEntity.prototype, "isUIReadOnly", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        default: true,
        type: 'boolean'
    }),
    _ts_metadata("design:type", Object)
], FieldMetadataEntity.prototype, "isNullable", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], FieldMetadataEntity.prototype, "isLabelSyncedWithName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", typeof _assigntypeifismorphorrelationfieldmetadatatypetype.AssignTypeIfIsMorphOrRelationFieldMetadataType === "undefined" ? Object : _assigntypeifismorphorrelationfieldmetadatatypetype.AssignTypeIfIsMorphOrRelationFieldMetadataType)
], FieldMetadataEntity.prototype, "relationTargetFieldMetadataId", void 0);
_ts_decorate([
    (0, _typeorm.OneToOne)(()=>FieldMetadataEntity, (fieldMetadata)=>fieldMetadata.relationTargetFieldMetadataId, {
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'relationTargetFieldMetadataId'
    }),
    _ts_metadata("design:type", typeof _assigntypeifismorphorrelationfieldmetadatatypetype.AssignTypeIfIsMorphOrRelationFieldMetadataType === "undefined" ? Object : _assigntypeifismorphorrelationfieldmetadatatypetype.AssignTypeIfIsMorphOrRelationFieldMetadataType)
], FieldMetadataEntity.prototype, "relationTargetFieldMetadata", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", typeof _assigntypeifismorphorrelationfieldmetadatatypetype.AssignTypeIfIsMorphOrRelationFieldMetadataType === "undefined" ? Object : _assigntypeifismorphorrelationfieldmetadatatypetype.AssignTypeIfIsMorphOrRelationFieldMetadataType)
], FieldMetadataEntity.prototype, "relationTargetObjectMetadataId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_objectmetadataentity.ObjectMetadataEntity, {
        onDelete: 'CASCADE',
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'relationTargetObjectMetadataId'
    }),
    _ts_metadata("design:type", typeof _assigntypeifismorphorrelationfieldmetadatatypetype.AssignTypeIfIsMorphOrRelationFieldMetadataType === "undefined" ? Object : _assigntypeifismorphorrelationfieldmetadatatypetype.AssignTypeIfIsMorphOrRelationFieldMetadataType)
], FieldMetadataEntity.prototype, "relationTargetObjectMetadata", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'uuid'
    }),
    _ts_metadata("design:type", typeof _assignifisgivenfieldmetadatatypetype.AssignIfIsGivenFieldMetadataType === "undefined" ? Object : _assignifisgivenfieldmetadatatypetype.AssignIfIsGivenFieldMetadataType)
], FieldMetadataEntity.prototype, "morphId", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_indexfieldmetadataentity.IndexFieldMetadataEntity, (indexFieldMetadata)=>indexFieldMetadata.indexMetadata, {
        cascade: true
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FieldMetadataEntity.prototype, "indexFieldMetadatas", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], FieldMetadataEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], FieldMetadataEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_fieldpermissionentity.FieldPermissionEntity, (fieldPermission)=>fieldPermission.fieldMetadata),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FieldMetadataEntity.prototype, "fieldPermissions", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_viewfieldentity.ViewFieldEntity, (viewField)=>viewField.fieldMetadata),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FieldMetadataEntity.prototype, "viewFields", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_viewfilterentity.ViewFilterEntity, (viewFilter)=>viewFilter.fieldMetadata),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FieldMetadataEntity.prototype, "viewFilters", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_viewentity.ViewEntity, (view)=>view.kanbanAggregateOperationFieldMetadata),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FieldMetadataEntity.prototype, "kanbanAggregateOperationViews", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_viewentity.ViewEntity, (view)=>view.calendarFieldMetadata),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FieldMetadataEntity.prototype, "calendarViews", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_viewentity.ViewEntity, (view)=>view.calendarEndFieldMetadata),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FieldMetadataEntity.prototype, "calendarEndViews", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_viewentity.ViewEntity, (view)=>view.mainGroupByFieldMetadata),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FieldMetadataEntity.prototype, "mainGroupByFieldMetadataViews", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_viewsortentity.ViewSortEntity, (viewSort)=>viewSort.fieldMetadata),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FieldMetadataEntity.prototype, "viewSorts", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_searchfieldmetadataentity.SearchFieldMetadataEntity, (searchFieldMetadata)=>searchFieldMetadata.fieldMetadata),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], FieldMetadataEntity.prototype, "searchFieldMetadatas", void 0);
FieldMetadataEntity = _ts_decorate([
    (0, _typeorm.Entity)('fieldMetadata'),
    (0, _typeorm.Check)('CHK_FIELD_METADATA_MORPH_RELATION_REQUIRES_MORPH_ID', `("type" != 'MORPH_RELATION') OR ("type" = 'MORPH_RELATION' AND "morphId" IS NOT NULL)`),
    (0, _typeorm.Index)('IDX_FIELD_METADATA_RELATION_TARGET_FIELD_METADATA_ID', [
        'relationTargetFieldMetadataId'
    ]),
    (0, _typeorm.Index)('IDX_FIELD_METADATA_RELATION_TARGET_OBJECT_METADATA_ID', [
        'relationTargetObjectMetadataId'
    ]),
    (0, _typeorm.Unique)('IDX_FIELD_METADATA_NAME_OBJECT_METADATA_ID_WORKSPACE_ID_UNIQUE', [
        'name',
        'objectMetadataId',
        'workspaceId'
    ]),
    (0, _typeorm.Index)('IDX_FIELD_METADATA_OBJECT_METADATA_ID_WORKSPACE_ID', [
        'objectMetadataId',
        'workspaceId'
    ]),
    (0, _typeorm.Index)('IDX_FIELD_METADATA_WORKSPACE_ID', [
        'workspaceId'
    ])
], FieldMetadataEntity);

//# sourceMappingURL=field-metadata.entity.js.map