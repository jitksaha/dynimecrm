"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddCalendarEndFieldMetadataIdToViewFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddCalendarEndFieldMetadataIdToViewFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddCalendarEndFieldMetadataIdToViewFastInstanceCommand = class AddCalendarEndFieldMetadataIdToViewFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."view" ADD COLUMN IF NOT EXISTS "calendarEndFieldMetadataId" uuid');
        await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_VIEW_CALENDAR_END_FIELD_METADATA" ON "core"."view" ("calendarEndFieldMetadataId") ');
        await queryRunner.query('DO $$ BEGIN ALTER TABLE "core"."view" ADD CONSTRAINT "FK_e1d69dd7402cd7df3b03ce11311" FOREIGN KEY ("calendarEndFieldMetadataId") REFERENCES "core"."fieldMetadata"("id") ON DELETE SET NULL ON UPDATE NO ACTION; EXCEPTION WHEN duplicate_object THEN NULL; END $$');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."view" DROP CONSTRAINT IF EXISTS "FK_e1d69dd7402cd7df3b03ce11311"');
        await queryRunner.query('DROP INDEX IF EXISTS "core"."IDX_VIEW_CALENDAR_END_FIELD_METADATA"');
        await queryRunner.query('ALTER TABLE "core"."view" DROP COLUMN IF EXISTS "calendarEndFieldMetadataId"');
    }
};
AddCalendarEndFieldMetadataIdToViewFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.22.0', 1783956795000)
], AddCalendarEndFieldMetadataIdToViewFastInstanceCommand);

//# sourceMappingURL=2-22-instance-command-fast-1783956795000-add-calendar-end-field-metadata-id-to-view.js.map