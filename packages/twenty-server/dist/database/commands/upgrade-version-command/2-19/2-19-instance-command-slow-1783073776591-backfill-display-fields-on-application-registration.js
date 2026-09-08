"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillDisplayFieldsOnApplicationRegistrationSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillDisplayFieldsOnApplicationRegistrationSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BackfillDisplayFieldsOnApplicationRegistrationSlowInstanceCommand = class BackfillDisplayFieldsOnApplicationRegistrationSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`UPDATE "core"."applicationRegistration"
       SET
         "description" = "manifest"->'application'->>'description',
         "author" = "manifest"->'application'->>'author',
         "category" = "manifest"->'application'->>'category',
         "websiteUrl" = "manifest"->'application'->>'websiteUrl',
         "aboutDescription" = "manifest"->'application'->>'aboutDescription',
         "termsUrl" = "manifest"->'application'->>'termsUrl',
         "emailSupport" = "manifest"->'application'->>'emailSupport',
         "issueReportUrl" = "manifest"->'application'->>'issueReportUrl',
         "screenshots" = COALESCE(ARRAY(SELECT jsonb_array_elements_text("manifest"->'application'->'screenshots')), '{}')
       WHERE "manifest" IS NOT NULL`);
    }
    async up(_queryRunner) {}
    async down(queryRunner) {
        await queryRunner.query(`UPDATE "core"."applicationRegistration"
       SET
         "description" = NULL,
         "author" = NULL,
         "category" = NULL,
         "websiteUrl" = NULL,
         "aboutDescription" = NULL,
         "termsUrl" = NULL,
         "emailSupport" = NULL,
         "issueReportUrl" = NULL,
         "screenshots" = '{}'`);
    }
};
BackfillDisplayFieldsOnApplicationRegistrationSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1783073776591, {
        type: 'slow'
    })
], BackfillDisplayFieldsOnApplicationRegistrationSlowInstanceCommand);

//# sourceMappingURL=2-19-instance-command-slow-1783073776591-backfill-display-fields-on-application-registration.js.map