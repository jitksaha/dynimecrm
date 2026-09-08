"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillGalleryImagesOnApplicationRegistrationSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillGalleryImagesOnApplicationRegistrationSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BackfillGalleryImagesOnApplicationRegistrationSlowInstanceCommand = class BackfillGalleryImagesOnApplicationRegistrationSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`UPDATE "core"."applicationRegistration" AS "registration"
      SET "galleryImages" = "screenshotEntries"."galleryImages"
      FROM (
        SELECT
          "id",
          jsonb_agg(
            jsonb_build_object('path', "screenshot", 'fileId', NULL)
            ORDER BY "ordinality"
          ) AS "galleryImages"
        FROM "core"."applicationRegistration",
          unnest("screenshots") WITH ORDINALITY AS "unnested"("screenshot", "ordinality")
        GROUP BY "id"
      ) AS "screenshotEntries"
      WHERE "registration"."id" = "screenshotEntries"."id"
        AND "registration"."galleryImages" IS NULL`);
    }
    async up(_queryRunner) {}
    async down(_queryRunner) {}
};
BackfillGalleryImagesOnApplicationRegistrationSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.20.0', 1783615890056, {
        type: 'slow'
    })
], BackfillGalleryImagesOnApplicationRegistrationSlowInstanceCommand);

//# sourceMappingURL=2-20-instance-command-slow-1783615890056-backfill-gallery-images-on-application-registration.js.map