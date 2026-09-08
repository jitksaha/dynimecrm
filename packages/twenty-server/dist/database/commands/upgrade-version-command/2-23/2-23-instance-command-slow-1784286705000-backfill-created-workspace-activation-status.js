"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillCreatedWorkspaceActivationStatusSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillCreatedWorkspaceActivationStatusSlowInstanceCommand;
    }
});
const _common = require("@nestjs/common");
const _twentyconfigservice = require("../../../../engine/core-modules/twenty-config/twenty-config.service");
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
const V2_ONBOARDING_RELEASE_DATE = '2026-07-01';
let BackfillCreatedWorkspaceActivationStatusSlowInstanceCommand = class BackfillCreatedWorkspaceActivationStatusSlowInstanceCommand {
    async runDataMigration(dataSource) {
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return;
        }
        const backfilledWorkspaces = await dataSource.query(`UPDATE "core"."workspace" "workspace"
       SET "activationStatus" = 'CREATED'
       WHERE "workspace"."activationStatus" = 'ACTIVE'
         AND "workspace"."deletedAt" IS NULL
         AND "workspace"."createdAt" >= $1
         AND NOT EXISTS (
           SELECT 1
           FROM "core"."billingSubscription" "billingSubscription"
           WHERE "billingSubscription"."workspaceId" = "workspace"."id"
         )
       RETURNING "workspace"."id"`, [
            V2_ONBOARDING_RELEASE_DATE
        ]);
        this.logger.log(`Backfilled ${backfilledWorkspaces.length} subscription-less active workspace(s) to CREATED`);
    }
    async up(_queryRunner) {}
    async down(_queryRunner) {}
    constructor(twentyConfigService){
        this.twentyConfigService = twentyConfigService;
        this.logger = new _common.Logger(BackfillCreatedWorkspaceActivationStatusSlowInstanceCommand.name);
    }
};
BackfillCreatedWorkspaceActivationStatusSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.23.0', 1784286705000, {
        type: 'slow'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], BackfillCreatedWorkspaceActivationStatusSlowInstanceCommand);

//# sourceMappingURL=2-23-instance-command-slow-1784286705000-backfill-created-workspace-activation-status.js.map