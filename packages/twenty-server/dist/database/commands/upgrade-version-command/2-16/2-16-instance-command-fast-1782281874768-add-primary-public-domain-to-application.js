"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddPrimaryPublicDomainToApplicationFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddPrimaryPublicDomainToApplicationFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddPrimaryPublicDomainToApplicationFastInstanceCommand = class AddPrimaryPublicDomainToApplicationFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."application" ADD "primaryPublicDomainId" uuid');
        await queryRunner.query('ALTER TABLE "core"."application" ADD CONSTRAINT "FK_38ac5dccee353ca07862a5a94bf" FOREIGN KEY ("primaryPublicDomainId") REFERENCES "core"."publicDomain"("id") ON DELETE SET NULL ON UPDATE NO ACTION');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."application" DROP CONSTRAINT "FK_38ac5dccee353ca07862a5a94bf"');
        await queryRunner.query('ALTER TABLE "core"."application" DROP COLUMN "primaryPublicDomainId"');
    }
};
AddPrimaryPublicDomainToApplicationFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.16.0', 1782281874768)
], AddPrimaryPublicDomainToApplicationFastInstanceCommand);

//# sourceMappingURL=2-16-instance-command-fast-1782281874768-add-primary-public-domain-to-application.js.map