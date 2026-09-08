"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MakePublicDomainApplicationIdNotNullSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return MakePublicDomainApplicationIdNotNullSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MakePublicDomainApplicationIdNotNullSlowInstanceCommand = class MakePublicDomainApplicationIdNotNullSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`DELETE FROM "core"."publicDomain" WHERE "applicationId" IS NULL`);
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."publicDomain" ALTER COLUMN "applicationId" SET NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."publicDomain" ALTER COLUMN "applicationId" DROP NOT NULL`);
    }
};
MakePublicDomainApplicationIdNotNullSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.16.0', 1782281874769, {
        type: 'slow'
    })
], MakePublicDomainApplicationIdNotNullSlowInstanceCommand);

//# sourceMappingURL=2-16-instance-command-slow-1782281874769-make-public-domain-application-id-not-null.js.map