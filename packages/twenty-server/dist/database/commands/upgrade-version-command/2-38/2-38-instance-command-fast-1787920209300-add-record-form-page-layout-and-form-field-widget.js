"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddRecordFormPageLayoutAndFormFieldWidgetFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddRecordFormPageLayoutAndFormFieldWidgetFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const PAGE_LAYOUT_TYPES_BEFORE = "'RECORD_INDEX', 'RECORD_PAGE', 'DASHBOARD', 'STANDALONE_PAGE'";
const PAGE_LAYOUT_TYPES_AFTER = `${PAGE_LAYOUT_TYPES_BEFORE}, 'RECORD_FORM'`;
const WIDGET_TYPES_BEFORE = "'VIEW', 'IFRAME', 'FIELD', 'FIELDS', 'GRAPH', 'STANDALONE_RICH_TEXT', 'TIMELINE', 'TASKS', 'NOTES', 'FILES', 'EMAILS', 'CALENDAR', 'FIELD_RICH_TEXT', 'WORKFLOW', 'WORKFLOW_VERSION', 'WORKFLOW_RUN', 'FRONT_COMPONENT', 'RECORD_TABLE', 'EMAIL_THREAD', 'CALL_RECORDING_SUMMARY', 'CALL_RECORDING_TRANSCRIPT', 'MESSAGE_CAMPAIGN_BODY', 'MESSAGE_CAMPAIGN_DETAILS'";
const WIDGET_TYPES_AFTER = `${WIDGET_TYPES_BEFORE}, 'FORM_FIELD'`;
let AddRecordFormPageLayoutAndFormFieldWidgetFastInstanceCommand = class AddRecordFormPageLayoutAndFormFieldWidgetFastInstanceCommand {
    async up(queryRunner) {
        await this.replacePageLayoutTypeEnum(queryRunner, PAGE_LAYOUT_TYPES_AFTER);
        await this.replaceWidgetTypeEnum(queryRunner, WIDGET_TYPES_AFTER);
    }
    async down(queryRunner) {
        await queryRunner.query(`DELETE FROM "core"."pageLayoutWidget" WHERE "type" = 'FORM_FIELD'`);
        await queryRunner.query(`DELETE FROM "core"."pageLayout" WHERE "type" = 'RECORD_FORM'`);
        await this.replaceWidgetTypeEnum(queryRunner, WIDGET_TYPES_BEFORE);
        await this.replacePageLayoutTypeEnum(queryRunner, PAGE_LAYOUT_TYPES_BEFORE);
    }
    async replacePageLayoutTypeEnum(queryRunner, enumValues) {
        await queryRunner.query('ALTER TYPE "core"."pageLayout_type_enum" RENAME TO "pageLayout_type_enum_old"');
        await queryRunner.query(`CREATE TYPE "core"."pageLayout_type_enum" AS ENUM(${enumValues})`);
        await queryRunner.query('ALTER TABLE "core"."pageLayout" ALTER COLUMN "type" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "core"."pageLayout" ALTER COLUMN "type" TYPE "core"."pageLayout_type_enum" USING "type"::"text"::"core"."pageLayout_type_enum"');
        await queryRunner.query(`ALTER TABLE "core"."pageLayout" ALTER COLUMN "type" SET DEFAULT 'RECORD_PAGE'`);
        await queryRunner.query('DROP TYPE "core"."pageLayout_type_enum_old"');
    }
    async replaceWidgetTypeEnum(queryRunner, enumValues) {
        await queryRunner.query('ALTER TYPE "core"."pageLayoutWidget_type_enum" RENAME TO "pageLayoutWidget_type_enum_old"');
        await queryRunner.query(`CREATE TYPE "core"."pageLayoutWidget_type_enum" AS ENUM(${enumValues})`);
        await queryRunner.query('ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" TYPE "core"."pageLayoutWidget_type_enum" USING "type"::"text"::"core"."pageLayoutWidget_type_enum"');
        await queryRunner.query(`ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" SET DEFAULT 'VIEW'`);
        await queryRunner.query('DROP TYPE "core"."pageLayoutWidget_type_enum_old"');
    }
};
AddRecordFormPageLayoutAndFormFieldWidgetFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.38.0', 1787920209300)
], AddRecordFormPageLayoutAndFormFieldWidgetFastInstanceCommand);

//# sourceMappingURL=2-38-instance-command-fast-1787920209300-add-record-form-page-layout-and-form-field-widget.js.map