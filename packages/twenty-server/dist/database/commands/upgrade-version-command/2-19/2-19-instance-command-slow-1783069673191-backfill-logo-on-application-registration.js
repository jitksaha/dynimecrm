"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillLogoOnApplicationRegistrationSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillLogoOnApplicationRegistrationSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BackfillLogoOnApplicationRegistrationSlowInstanceCommand = class BackfillLogoOnApplicationRegistrationSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`UPDATE "core"."applicationRegistration" SET "logo" = "manifest"->'application'->>'logoUrl' WHERE "manifest" IS NOT NULL AND "logo" IS NULL`);
    }
    async up(_queryRunner) {}
    async down(queryRunner) {
        await queryRunner.query('UPDATE "core"."applicationRegistration" SET "logo" = NULL');
    }
};
BackfillLogoOnApplicationRegistrationSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1783069673191, {
        type: 'slow'
    })
], BackfillLogoOnApplicationRegistrationSlowInstanceCommand);

//# sourceMappingURL=2-19-instance-command-slow-1783069673191-backfill-logo-on-application-registration.js.map