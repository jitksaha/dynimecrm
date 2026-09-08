"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UnlistUnclaimedNpmApplicationRegistrationsSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return UnlistUnclaimedNpmApplicationRegistrationsSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UnlistUnclaimedNpmApplicationRegistrationsSlowInstanceCommand = class UnlistUnclaimedNpmApplicationRegistrationsSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`UPDATE "core"."applicationRegistration"
       SET "isListed" = false
       WHERE "sourceType" = 'npm'
         AND "workspaceId" IS NULL
         AND "isVetted" = false`);
    }
    async up(_queryRunner) {}
    async down(queryRunner) {
        // Approximate rollback: rows that were manually unlisted before this
        // migration cannot be told apart and may be relisted.
        await queryRunner.query(`UPDATE "core"."applicationRegistration"
       SET "isListed" = true
       WHERE "sourceType" = 'npm'
         AND "workspaceId" IS NULL
         AND "isVetted" = false`);
    }
};
UnlistUnclaimedNpmApplicationRegistrationsSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.23.0', 1784322591746, {
        type: 'slow'
    })
], UnlistUnclaimedNpmApplicationRegistrationsSlowInstanceCommand);

//# sourceMappingURL=2-23-instance-command-slow-1784322591746-unlist-unclaimed-npm-application-registrations.js.map