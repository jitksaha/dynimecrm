"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EncryptEmptyApplicationVariablesSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return EncryptEmptyApplicationVariablesSlowInstanceCommand;
    }
});
const _common = require("@nestjs/common");
const _applicationregistrationvariableentity = require("../../../../engine/core-modules/application/application-registration-variable/application-registration-variable.entity");
const _applicationvariableentity = require("../../../../engine/core-modules/application/application-variable/application-variable.entity");
const _secretencryptionservice = require("../../../../engine/core-modules/secret-encryption/secret-encryption.service");
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const EMPTY_PLAINTEXT = '';
const LEGACY_EMPTY_VALUE = '';
let EncryptEmptyApplicationVariablesSlowInstanceCommand = class EncryptEmptyApplicationVariablesSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await this.encryptEmptyRegistrationVariables(dataSource);
        await this.encryptEmptyApplicationVariables(dataSource);
    }
    async encryptEmptyRegistrationVariables(dataSource) {
        const applicationRegistrationVariableRepository = dataSource.getRepository(_applicationregistrationvariableentity.ApplicationRegistrationVariableEntity);
        const { affected } = await applicationRegistrationVariableRepository.update({
            encryptedValue: LEGACY_EMPTY_VALUE
        }, {
            encryptedValue: this.secretEncryptionService.encryptVersioned(EMPTY_PLAINTEXT)
        });
        this.logger.log(`core.applicationRegistrationVariable: encrypted ${affected ?? 0} empty value(s)`);
    }
    // The encryption key is derived from the workspaceId, so each workspace
    // needs its own envelope of the empty string.
    async encryptEmptyApplicationVariables(dataSource) {
        const applicationVariableRepository = dataSource.getRepository(_applicationvariableentity.ApplicationVariableEntity);
        const workspaceRows = await applicationVariableRepository.createQueryBuilder('applicationVariable').select('applicationVariable.workspaceId', 'workspaceId').where('applicationVariable.value = :legacyEmptyValue', {
            legacyEmptyValue: LEGACY_EMPTY_VALUE
        }).distinct(true).getRawMany();
        let encryptedCount = 0;
        for (const { workspaceId } of workspaceRows){
            const { affected } = await applicationVariableRepository.update({
                workspaceId,
                value: LEGACY_EMPTY_VALUE
            }, {
                value: this.secretEncryptionService.encryptVersioned(EMPTY_PLAINTEXT, {
                    workspaceId
                })
            });
            encryptedCount += affected ?? 0;
        }
        this.logger.log(`core.applicationVariable: encrypted ${encryptedCount} empty value(s)`);
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" DROP CONSTRAINT IF EXISTS "CHK_applicationVariable_value_encrypted"`);
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" ADD CONSTRAINT "CHK_applicationVariable_value_encrypted" CHECK ("value" LIKE 'enc:v2:%')`);
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" ALTER COLUMN "value" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" DROP CONSTRAINT IF EXISTS "CHK_applicationRegistrationVariable_encryptedValue_encrypted"`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" ADD CONSTRAINT "CHK_applicationRegistrationVariable_encryptedValue_encrypted" CHECK ("encryptedValue" LIKE 'enc:v2:%')`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" ALTER COLUMN "encryptedValue" DROP DEFAULT`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" ALTER COLUMN "encryptedValue" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" DROP CONSTRAINT IF EXISTS "CHK_applicationRegistrationVariable_encryptedValue_encrypted"`);
        await queryRunner.query(`ALTER TABLE "core"."applicationRegistrationVariable" ADD CONSTRAINT "CHK_applicationRegistrationVariable_encryptedValue_encrypted" CHECK ("encryptedValue" = '' OR "encryptedValue" LIKE 'enc:v2:%')`);
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" ALTER COLUMN "value" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" DROP CONSTRAINT IF EXISTS "CHK_applicationVariable_value_encrypted"`);
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable" ADD CONSTRAINT "CHK_applicationVariable_value_encrypted" CHECK ("value" = '' OR "value" LIKE 'enc:v2:%')`);
    }
    constructor(secretEncryptionService){
        this.secretEncryptionService = secretEncryptionService;
        this.logger = new _common.Logger(EncryptEmptyApplicationVariablesSlowInstanceCommand.name);
    }
};
EncryptEmptyApplicationVariablesSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.31.0', 1786533438000, {
        type: 'slow'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _secretencryptionservice.SecretEncryptionService === "undefined" ? Object : _secretencryptionservice.SecretEncryptionService
    ])
], EncryptEmptyApplicationVariablesSlowInstanceCommand);

//# sourceMappingURL=2-31-instance-command-slow-1786533438000-encrypt-empty-application-variables.js.map