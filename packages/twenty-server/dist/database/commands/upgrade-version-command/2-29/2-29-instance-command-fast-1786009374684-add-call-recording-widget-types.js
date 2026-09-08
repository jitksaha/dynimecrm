"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddCallRecordingWidgetTypesFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddCallRecordingWidgetTypesFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddCallRecordingWidgetTypesFastInstanceCommand = class AddCallRecordingWidgetTypesFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query('ALTER TYPE "core"."pageLayoutWidget_type_enum" RENAME TO "pageLayoutWidget_type_enum_old"');
        await queryRunner.query("CREATE TYPE \"core\".\"pageLayoutWidget_type_enum\" AS ENUM('VIEW', 'IFRAME', 'FIELD', 'FIELDS', 'GRAPH', 'STANDALONE_RICH_TEXT', 'TIMELINE', 'TASKS', 'NOTES', 'FILES', 'EMAILS', 'CALENDAR', 'FIELD_RICH_TEXT', 'WORKFLOW', 'WORKFLOW_VERSION', 'WORKFLOW_RUN', 'FRONT_COMPONENT', 'RECORD_TABLE', 'EMAIL_THREAD', 'CALL_RECORDING_SUMMARY', 'CALL_RECORDING_TRANSCRIPT', 'MESSAGE_CAMPAIGN_BODY', 'MESSAGE_CAMPAIGN_DETAILS')");
        await queryRunner.query('ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" TYPE "core"."pageLayoutWidget_type_enum" USING "type"::"text"::"core"."pageLayoutWidget_type_enum"');
        await queryRunner.query('ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" SET DEFAULT \'VIEW\'');
        await queryRunner.query('DROP TYPE "core"."pageLayoutWidget_type_enum_old"');
    }
    async down(queryRunner) {
        await queryRunner.query(`DELETE FROM "core"."pageLayoutWidget" WHERE "type" IN ('CALL_RECORDING_SUMMARY', 'CALL_RECORDING_TRANSCRIPT')`);
        await queryRunner.query("CREATE TYPE \"core\".\"pageLayoutWidget_type_enum_old\" AS ENUM('VIEW', 'IFRAME', 'FIELD', 'FIELDS', 'GRAPH', 'STANDALONE_RICH_TEXT', 'TIMELINE', 'TASKS', 'NOTES', 'FILES', 'EMAILS', 'CALENDAR', 'FIELD_RICH_TEXT', 'WORKFLOW', 'WORKFLOW_VERSION', 'WORKFLOW_RUN', 'FRONT_COMPONENT', 'RECORD_TABLE', 'EMAIL_THREAD', 'MESSAGE_CAMPAIGN_BODY', 'MESSAGE_CAMPAIGN_DETAILS')");
        await queryRunner.query('ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" TYPE "core"."pageLayoutWidget_type_enum_old" USING "type"::"text"::"core"."pageLayoutWidget_type_enum_old"');
        await queryRunner.query('ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" SET DEFAULT \'VIEW\'');
        await queryRunner.query('DROP TYPE "core"."pageLayoutWidget_type_enum"');
        await queryRunner.query('ALTER TYPE "core"."pageLayoutWidget_type_enum_old" RENAME TO "pageLayoutWidget_type_enum"');
    }
};
AddCallRecordingWidgetTypesFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.29.0', 1786009374684)
], AddCallRecordingWidgetTypesFastInstanceCommand);

//# sourceMappingURL=2-29-instance-command-fast-1786009374684-add-call-recording-widget-types.js.map