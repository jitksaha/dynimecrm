"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RenameIsFeaturedToIsVettedOnApplicationRegistrationFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return RenameIsFeaturedToIsVettedOnApplicationRegistrationFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let RenameIsFeaturedToIsVettedOnApplicationRegistrationFastInstanceCommand = class RenameIsFeaturedToIsVettedOnApplicationRegistrationFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" RENAME COLUMN "isFeatured" TO "isVetted"');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" RENAME COLUMN "isVetted" TO "isFeatured"');
    }
};
RenameIsFeaturedToIsVettedOnApplicationRegistrationFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.20.0', 1783527064000)
], RenameIsFeaturedToIsVettedOnApplicationRegistrationFastInstanceCommand);

//# sourceMappingURL=2-20-instance-command-fast-1783527064000-rename-is-featured-to-is-vetted-on-application-registration.js.map