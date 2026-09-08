"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WidenViewCalendarIntegrityConstraintFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return WidenViewCalendarIntegrityConstraintFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WidenViewCalendarIntegrityConstraintFastInstanceCommand = class WidenViewCalendarIntegrityConstraintFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."view" DROP CONSTRAINT IF EXISTS "CHK_VIEW_CALENDAR_INTEGRITY"');
        await queryRunner.query(`ALTER TABLE "core"."view" ADD CONSTRAINT "CHK_VIEW_CALENDAR_INTEGRITY" CHECK ("type" NOT IN ('CALENDAR', 'CALENDAR_WIDGET') OR ("calendarLayout" IS NOT NULL AND "calendarFieldMetadataId" IS NOT NULL))`);
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE "core"."view" DROP CONSTRAINT IF EXISTS "CHK_VIEW_CALENDAR_INTEGRITY"');
        await queryRunner.query(`ALTER TABLE "core"."view" ADD CONSTRAINT "CHK_VIEW_CALENDAR_INTEGRITY" CHECK ("type" != 'CALENDAR' OR ("calendarLayout" IS NOT NULL AND "calendarFieldMetadataId" IS NOT NULL))`);
    }
};
WidenViewCalendarIntegrityConstraintFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.23.0', 1784620626406)
], WidenViewCalendarIntegrityConstraintFastInstanceCommand);

//# sourceMappingURL=2-23-instance-command-fast-1784620626406-widen-view-calendar-integrity-constraint.js.map