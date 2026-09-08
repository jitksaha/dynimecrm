"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillIsFeaturedOnApplicationRegistrationSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillIsFeaturedOnApplicationRegistrationSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const FEATURED_UNIVERSAL_IDENTIFIERS = [
    '8da4b8b5-5edf-4880-b51f-ab6e679ec617',
    '4a1178c1-3535-4a47-b592-231d3216b36f',
    '66a504cc-0a75-410e-a43f-cdeae1db1522'
];
let BackfillIsFeaturedOnApplicationRegistrationSlowInstanceCommand = class BackfillIsFeaturedOnApplicationRegistrationSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`UPDATE "core"."applicationRegistration"
       SET "isFeatured" = true
       WHERE "universalIdentifier" = ANY($1::uuid[])`, [
            FEATURED_UNIVERSAL_IDENTIFIERS
        ]);
    }
    async up(_queryRunner) {}
    async down(queryRunner) {
        await queryRunner.query(`UPDATE "core"."applicationRegistration"
       SET "isFeatured" = false
       WHERE "universalIdentifier" = ANY($1::uuid[])`, [
            FEATURED_UNIVERSAL_IDENTIFIERS
        ]);
    }
};
BackfillIsFeaturedOnApplicationRegistrationSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.19.0', 1783120000000, {
        type: 'slow'
    })
], BackfillIsFeaturedOnApplicationRegistrationSlowInstanceCommand);

//# sourceMappingURL=2-19-instance-command-slow-1783120000000-backfill-is-featured-on-application-registration.js.map