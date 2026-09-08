"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EncryptNonSecretApplicationVariableSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return EncryptNonSecretApplicationVariableSlowInstanceCommand;
    }
});
const _common = require("@nestjs/common");
const _isencryptedstringutil = require("../../../../engine/core-modules/secret-encryption/branded-strings/is-encrypted-string.util");
const _secretencryptionconstant = require("../../../../engine/core-modules/secret-encryption/constants/secret-encryption.constant");
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
const BACKFILL_BATCH_SIZE = 500;
const VALUE_CHECK_CONSTRAINT_NAME = 'CHK_applicationVariable_value_encrypted';
const V2_ENCRYPTED_LIKE_PATTERN = `${_secretencryptionconstant.SECRET_ENCRYPTION_ENVELOPE_V2_PREFIX}%`;
let EncryptNonSecretApplicationVariableSlowInstanceCommand = class EncryptNonSecretApplicationVariableSlowInstanceCommand {
    async runDataMigration(dataSource) {
        let cursor = '00000000-0000-0000-0000-000000000000';
        let totalEncrypted = 0;
        while(true){
            const rows = await dataSource.query(`SELECT id, "workspaceId", "value"
           FROM "core"."applicationVariable"
          WHERE id > $1
            AND "isSecret" = false
            AND "value" <> ''
            AND "value" NOT LIKE $2
          ORDER BY id
          LIMIT $3`, [
                cursor,
                V2_ENCRYPTED_LIKE_PATTERN,
                BACKFILL_BATCH_SIZE
            ]);
            if (rows.length === 0) {
                break;
            }
            let batchEncrypted = 0;
            for (const row of rows){
                if ((0, _isencryptedstringutil.isEncryptedString)(row.value)) {
                    continue;
                }
                const encryptedValue = this.secretEncryptionService.encryptVersioned(row.value, {
                    workspaceId: row.workspaceId
                });
                await dataSource.query(`UPDATE "core"."applicationVariable"
              SET "value" = $2
            WHERE id = $1`, [
                    row.id,
                    encryptedValue
                ]);
                batchEncrypted++;
            }
            totalEncrypted += batchEncrypted;
            cursor = rows[rows.length - 1].id;
            this.logger.log(`Encrypted ${batchEncrypted} non-secret application variables in this batch (${totalEncrypted} total so far)`);
        }
        this.logger.log(`Finished encrypting non-secret application variables: ${totalEncrypted} rows encrypted`);
    }
    // Tightens the CHECK constraint: all values must now be either empty
    // or in the enc:v2 envelope, regardless of isSecret.
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable"
       DROP CONSTRAINT IF EXISTS "${VALUE_CHECK_CONSTRAINT_NAME}"`);
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable"
       ADD CONSTRAINT "${VALUE_CHECK_CONSTRAINT_NAME}"
       CHECK ("value" = '' OR "value" LIKE '${V2_ENCRYPTED_LIKE_PATTERN}')`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable"
       DROP CONSTRAINT IF EXISTS "${VALUE_CHECK_CONSTRAINT_NAME}"`);
        // Restore the original constraint that allowed plaintext for non-secret rows
        await queryRunner.query(`ALTER TABLE "core"."applicationVariable"
       ADD CONSTRAINT "${VALUE_CHECK_CONSTRAINT_NAME}"
       CHECK ("isSecret" = false OR "value" = '' OR "value" LIKE '${V2_ENCRYPTED_LIKE_PATTERN}')`);
    }
    constructor(secretEncryptionService){
        this.secretEncryptionService = secretEncryptionService;
        this.logger = new _common.Logger(EncryptNonSecretApplicationVariableSlowInstanceCommand.name);
    }
};
EncryptNonSecretApplicationVariableSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.9.0', 1798400000000, {
        type: 'slow'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _secretencryptionservice.SecretEncryptionService === "undefined" ? Object : _secretencryptionservice.SecretEncryptionService
    ])
], EncryptNonSecretApplicationVariableSlowInstanceCommand);

//# sourceMappingURL=2-9-instance-command-slow-1798400000000-encrypt-non-secret-application-variable.js.map