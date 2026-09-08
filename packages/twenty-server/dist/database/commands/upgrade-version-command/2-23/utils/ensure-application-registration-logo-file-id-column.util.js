"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get dropApplicationRegistrationLogoFileIdColumn () {
        return dropApplicationRegistrationLogoFileIdColumn;
    },
    get ensureApplicationRegistrationLogoFileIdColumn () {
        return ensureApplicationRegistrationLogoFileIdColumn;
    }
});
const ensureApplicationRegistrationLogoFileIdColumn = async (query)=>{
    await query('ALTER TABLE "core"."applicationRegistration" ADD COLUMN IF NOT EXISTS "logoFileId" uuid');
    await query('ALTER TABLE "core"."applicationRegistration" DROP CONSTRAINT IF EXISTS "UQ_796819fb23559c233e6ebd49f34"');
    await query('ALTER TABLE "core"."applicationRegistration" ADD CONSTRAINT "UQ_796819fb23559c233e6ebd49f34" UNIQUE ("logoFileId")');
    await query('ALTER TABLE "core"."applicationRegistration" DROP CONSTRAINT IF EXISTS "FK_796819fb23559c233e6ebd49f34"');
    await query('ALTER TABLE "core"."applicationRegistration" ADD CONSTRAINT "FK_796819fb23559c233e6ebd49f34" FOREIGN KEY ("logoFileId") REFERENCES "core"."file"("id") ON DELETE SET NULL ON UPDATE NO ACTION');
};
const dropApplicationRegistrationLogoFileIdColumn = async (query)=>{
    await query('ALTER TABLE "core"."applicationRegistration" DROP CONSTRAINT IF EXISTS "FK_796819fb23559c233e6ebd49f34"');
    await query('ALTER TABLE "core"."applicationRegistration" DROP CONSTRAINT IF EXISTS "UQ_796819fb23559c233e6ebd49f34"');
    await query('ALTER TABLE "core"."applicationRegistration" DROP COLUMN IF EXISTS "logoFileId"');
};

//# sourceMappingURL=ensure-application-registration-logo-file-id-column.util.js.map