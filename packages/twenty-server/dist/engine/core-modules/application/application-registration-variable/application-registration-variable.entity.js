"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationRegistrationVariableEntity", {
    enumerable: true,
    get: function() {
        return ApplicationRegistrationVariableEntity;
    }
});
const _typeorm = require("typeorm");
const _types = require("twenty-shared/types");
const _addisdeprecatedtoapplicationvariablesupgradecommandnameconstant = require("../../../../database/commands/upgrade-version-command/2-31/add-is-deprecated-to-application-variables-upgrade-command-name.constant");
const _applicationregistrationentity = require("../application-registration/application-registration.entity");
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
let ApplicationRegistrationVariableEntity = class ApplicationRegistrationVariableEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], ApplicationRegistrationVariableEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'text'
    }),
    _ts_metadata("design:type", String)
], ApplicationRegistrationVariableEntity.prototype, "key", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'text'
    }),
    _ts_metadata("design:type", typeof EncryptedString === "undefined" ? Object : EncryptedString)
], ApplicationRegistrationVariableEntity.prototype, "encryptedValue", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'text',
        default: ''
    }),
    _ts_metadata("design:type", String)
], ApplicationRegistrationVariableEntity.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'boolean',
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], ApplicationRegistrationVariableEntity.prototype, "isSecret", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'boolean',
        default: false
    }),
    _ts_metadata("design:type", Boolean)
], ApplicationRegistrationVariableEntity.prototype, "isRequired", void 0);
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
], ApplicationRegistrationVariableEntity.prototype, "isDeprecated", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'text',
        default: _types.FieldMetadataType.TEXT
    }),
    _ts_metadata("design:type", typeof ApplicationVariableType === "undefined" ? Object : ApplicationVariableType)
], ApplicationRegistrationVariableEntity.prototype, "type", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true,
        type: 'jsonb',
        default: null
    }),
    _ts_metadata("design:type", Object)
], ApplicationRegistrationVariableEntity.prototype, "options", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: false,
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], ApplicationRegistrationVariableEntity.prototype, "applicationRegistrationId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_applicationregistrationentity.ApplicationRegistrationEntity, (applicationRegistration)=>applicationRegistration.variables, {
        onDelete: 'CASCADE',
        nullable: false
    }),
    (0, _typeorm.JoinColumn)({
        name: 'applicationRegistrationId'
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], ApplicationRegistrationVariableEntity.prototype, "applicationRegistration", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ApplicationRegistrationVariableEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ApplicationRegistrationVariableEntity.prototype, "updatedAt", void 0);
ApplicationRegistrationVariableEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'applicationRegistrationVariable',
        schema: 'core'
    }),
    (0, _typeorm.Unique)('IDX_APP_REG_VAR_KEY_APP_REGISTRATION_ID_UNIQUE', [
        'key',
        'applicationRegistrationId'
    ]),
    (0, _typeorm.Index)('IDX_APP_REG_VAR_APP_REGISTRATION_ID', [
        'applicationRegistrationId'
    ]),
    (0, _typeorm.Check)('CHK_applicationRegistrationVariable_encryptedValue_encrypted', `"encryptedValue" LIKE 'enc:v2:%'`),
    (0, _typeorm.Check)('CHK_applicationRegistrationVariable_deprecated_not_required', `NOT ("isRequired" AND "isDeprecated")`)
], ApplicationRegistrationVariableEntity);

//# sourceMappingURL=application-registration-variable.entity.js.map