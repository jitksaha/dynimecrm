"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddFrontComponentSharedDependenciesToApplicationFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddFrontComponentSharedDependenciesToApplicationFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddFrontComponentSharedDependenciesToApplicationFastInstanceCommand = class AddFrontComponentSharedDependenciesToApplicationFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."application" ADD COLUMN IF NOT EXISTS "frontComponentSharedDependenciesChecksum" text');
        await queryRunner.query('ALTER TABLE "core"."application" ADD COLUMN IF NOT EXISTS "frontComponentSharedDependenciesBuiltPath" text');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."application" DROP COLUMN IF EXISTS "frontComponentSharedDependenciesChecksum"');
        await queryRunner.query('ALTER TABLE "core"."application" DROP COLUMN IF EXISTS "frontComponentSharedDependenciesBuiltPath"');
    }
};
AddFrontComponentSharedDependenciesToApplicationFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.31.0', 1786529082690)
], AddFrontComponentSharedDependenciesToApplicationFastInstanceCommand);

//# sourceMappingURL=2-31-instance-command-fast-1786529082690-add-front-component-shared-dependencies-to-application.js.map