"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SearchFieldMetadataEntity", {
    enumerable: true,
    get: function() {
        return SearchFieldMetadataEntity;
    }
});
const _typeorm = require("typeorm");
const _adduniversalidentifierandapplicationidtosearchfieldmetadataupgradecommandnameconstant = require("../../../database/commands/upgrade-version-command/2-16/add-universal-identifier-and-application-id-to-search-field-metadata-upgrade-command-name.constant");
const _addtsvectorfieldmetadataidtosearchfieldmetadataupgradecommandnameconstant = require("../../../database/commands/upgrade-version-command/2-18/add-ts-vector-field-metadata-id-to-search-field-metadata-upgrade-command-name.constant");
const _addissystemsideeffecttosearchfieldmetadataupgradecommandnameconstant = require("../../../database/commands/upgrade-version-command/2-20/add-is-system-side-effect-to-search-field-metadata-upgrade-command-name.constant");
const _wasintroducedinupgradedecorator = require("../../core-modules/upgrade/decorators/was-introduced-in-upgrade.decorator");
const _fieldmetadataentity = require("../field-metadata/field-metadata.entity");
const _objectmetadataentity = require("../object-metadata/object-metadata.entity");
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
let SearchFieldMetadataEntity = class SearchFieldMetadataEntity extends _syncableentityinterface.SyncableEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], SearchFieldMetadataEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], SearchFieldMetadataEntity.prototype, "objectMetadataId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_objectmetadataentity.ObjectMetadataEntity, (objectMetadata)=>objectMetadata.searchFieldMetadatas, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'objectMetadataId'
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], SearchFieldMetadataEntity.prototype, "objectMetadata", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], SearchFieldMetadataEntity.prototype, "fieldMetadataId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_fieldmetadataentity.FieldMetadataEntity, (fieldMetadata)=>fieldMetadata.searchFieldMetadatas, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'fieldMetadataId'
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], SearchFieldMetadataEntity.prototype, "fieldMetadata", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addtsvectorfieldmetadataidtosearchfieldmetadataupgradecommandnameconstant.ADD_TS_VECTOR_FIELD_METADATA_ID_TO_SEARCH_FIELD_METADATA_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: false,
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], SearchFieldMetadataEntity.prototype, "tsVectorFieldMetadataId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_fieldmetadataentity.FieldMetadataEntity, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'tsVectorFieldMetadataId'
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], SearchFieldMetadataEntity.prototype, "tsVectorFieldMetadata", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'float'
    }),
    _ts_metadata("design:type", Number)
], SearchFieldMetadataEntity.prototype, "position", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addissystemsideeffecttosearchfieldmetadataupgradecommandnameconstant.ADD_IS_SYSTEM_SIDE_EFFECT_TO_SEARCH_FIELD_METADATA_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: false,
        default: true,
        type: 'boolean'
    }),
    _ts_metadata("design:type", Boolean)
], SearchFieldMetadataEntity.prototype, "isSystemSideEffect", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], SearchFieldMetadataEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], SearchFieldMetadataEntity.prototype, "updatedAt", void 0);
SearchFieldMetadataEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'searchFieldMetadata',
        schema: 'core'
    }),
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _adduniversalidentifierandapplicationidtosearchfieldmetadataupgradecommandnameconstant.ADD_UNIVERSAL_IDENTIFIER_AND_APPLICATION_ID_TO_SEARCH_FIELD_METADATA_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Unique)('IDX_SEARCH_FIELD_METADATA_OBJECT_FIELD_UNIQUE', [
        'objectMetadataId',
        'fieldMetadataId'
    ]),
    (0, _typeorm.Index)('IDX_SEARCH_FIELD_METADATA_WORKSPACE_ID', [
        'workspaceId'
    ]),
    (0, _typeorm.Index)('IDX_SEARCH_FIELD_METADATA_OBJECT_METADATA_ID', [
        'objectMetadataId'
    ])
], SearchFieldMetadataEntity);

//# sourceMappingURL=search-field-metadata.entity.js.map