"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddGalleryImagesToApplicationRegistrationFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddGalleryImagesToApplicationRegistrationFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddGalleryImagesToApplicationRegistrationFastInstanceCommand = class AddGalleryImagesToApplicationRegistrationFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "galleryImages" jsonb');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN IF EXISTS "galleryImages"');
    }
};
AddGalleryImagesToApplicationRegistrationFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.20.0', 1783615890055)
], AddGalleryImagesToApplicationRegistrationFastInstanceCommand);

//# sourceMappingURL=2-20-instance-command-fast-1783615890055-add-gallery-images-to-application-registration.js.map