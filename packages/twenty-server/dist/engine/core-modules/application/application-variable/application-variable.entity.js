"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationVariableEntity", {
    enumerable: true,
    get: function() {
        return ApplicationVariableEntity;
    }
});
const _graphql = require("@nestjs/graphql");
const _typeorm = require("typeorm");
const _types = require("twenty-shared/types");
const _addtypeandoptionstoapplicationvariablesupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-19/add-type-and-options-to-application-variables-upgrade-command-name.constant");
const _addisdeprecatedtoapplicationvariablesupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-31/add-is-deprecated-to-application-variables-upgrade-command-name.constant");
const _addlabeltoapplicationvariableupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-36/add-label-to-application-variable-upgrade-command-name.constant");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
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
let ApplicationVariableEntity = class ApplicationVariableEntity extends _syncableentityinterface.SyncableEntity {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], ApplicationVariableEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'text'
    }),
    _ts_metadata("design:type", String)
], ApplicationVariableEntity.prototype, "key", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'text'
    }),
    _ts_metadata("design:type", typeof EncryptedString === "undefined" ? Object : EncryptedString)
], ApplicationVariableEntity.prototype, "value", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'text',
        default: ''
    }),
    _ts_metadata("design:type", String)
], ApplicationVariableEntity.prototype, "description", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addlabeltoapplicationvariableupgradecommandnameconstant.ADD_LABEL_TO_APPLICATION_VARIABLE_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: false,
        type: 'text',
        default: ''
    }),
    _ts_metadata("design:type", String)
], ApplicationVariableEntity.prototype, "label", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], ApplicationVariableEntity.prototype, "isSecret", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addisdeprecatedtoapplicationvariablesupgradecommandnameconstant.ADD_IS_DEPRECATED_TO_APPLICATION_VARIABLES_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: false,
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], ApplicationVariableEntity.prototype, "isDeprecated", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addtypeandoptionstoapplicationvariablesupgradecommandnameconstant.ADD_TYPE_AND_OPTIONS_TO_APPLICATION_VARIABLES_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: false,
        type: 'text',
        default: _types.FieldMetadataType.TEXT
    }),
    _ts_metadata("design:type", typeof ApplicationVariableType === "undefined" ? Object : ApplicationVariableType)
], ApplicationVariableEntity.prototype, "type", void 0);
_ts_decorate([
    (0, _wasintroducedinupgradedecorator.WasIntroducedInUpgrade)({
        upgradeCommandName: _addtypeandoptionstoapplicationvariablesupgradecommandnameconstant.ADD_TYPE_AND_OPTIONS_TO_APPLICATION_VARIABLES_UPGRADE_COMMAND_NAME
    }),
    (0, _typeorm.Column)({
        nullable: true,
        type: 'jsonb',
        default: null
    }),
    _ts_metadata("design:type", Object)
], ApplicationVariableEntity.prototype, "options", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ApplicationVariableEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ApplicationVariableEntity.prototype, "updatedAt", void 0);
ApplicationVariableEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'applicationVariable',
        schema: 'core'
    }),
    (0, _graphql.ObjectType)('ApplicationVariable'),
    (0, _typeorm.Check)('CHK_applicationVariable_value_encrypted', `"value" LIKE 'enc:v2:%'`)
], ApplicationVariableEntity);

//# sourceMappingURL=application-variable.entity.js.map