"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillUninstallLogicFunctionIdOnApplicationSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillUninstallLogicFunctionIdOnApplicationSlowInstanceCommand;
    }
});
const _common = require("@nestjs/common");
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BackfillUninstallLogicFunctionIdOnApplicationSlowInstanceCommand = class BackfillUninstallLogicFunctionIdOnApplicationSlowInstanceCommand {
    async runDataMigration(dataSource) {
        const updatedRows = await dataSource.query(`UPDATE "core"."application" "application"
       SET "uninstallLogicFunctionId" = "logicFunction"."id"
       FROM "core"."applicationRegistration" "applicationRegistration",
            "core"."logicFunction" "logicFunction"
       WHERE "applicationRegistration"."id" = "application"."applicationRegistrationId"
       AND "logicFunction"."workspaceId" = "application"."workspaceId"
       AND "logicFunction"."applicationId" = "application"."id"
       AND "logicFunction"."universalIdentifier" = CASE
         WHEN "applicationRegistration"."manifest" -> 'application' -> 'uninstallLogicFunction' ->> 'universalIdentifier' ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
         THEN ("applicationRegistration"."manifest" -> 'application' -> 'uninstallLogicFunction' ->> 'universalIdentifier')::uuid
       END
       AND "logicFunction"."deletedAt" IS NULL
       AND "application"."deletedAt" IS NULL
       RETURNING "application"."id"`);
        this.logger.log(`core.application: backfilled uninstallLogicFunctionId on ${updatedRows.length} row(s)`);
    }
    async up(_queryRunner) {}
    // The paired fast command's down drops the column; nothing to undo here.
    async down(_queryRunner) {}
    constructor(){
        this.logger = new _common.Logger(BackfillUninstallLogicFunctionIdOnApplicationSlowInstanceCommand.name);
    }
};
BackfillUninstallLogicFunctionIdOnApplicationSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.32.0', 1786959731001, {
        type: 'slow'
    })
], BackfillUninstallLogicFunctionIdOnApplicationSlowInstanceCommand);

//# sourceMappingURL=2-32-instance-command-slow-1786959731001-backfill-uninstall-logic-function-id-on-application.js.map