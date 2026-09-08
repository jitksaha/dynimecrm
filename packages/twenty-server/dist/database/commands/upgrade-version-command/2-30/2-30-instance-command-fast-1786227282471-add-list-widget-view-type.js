"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddListWidgetViewTypeFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddListWidgetViewTypeFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddListWidgetViewTypeFastInstanceCommand = class AddListWidgetViewTypeFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TYPE "core"."view_type_enum" ADD VALUE IF NOT EXISTS 'LIST_WIDGET' AFTER 'KANBAN_WIDGET'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`UPDATE "core"."view" SET "type" = 'TABLE_WIDGET' WHERE "type" = 'LIST_WIDGET'`);
        await queryRunner.query("CREATE TYPE \"core\".\"view_type_enum_old\" AS ENUM('TABLE', 'KANBAN', 'CALENDAR', 'LIST', 'FIELDS_WIDGET', 'TABLE_WIDGET', 'KANBAN_WIDGET', 'CALENDAR_WIDGET')");
        await queryRunner.query('ALTER TABLE "core"."view" ALTER COLUMN "type" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "core"."view" ALTER COLUMN "type" TYPE "core"."view_type_enum_old" USING "type"::"text"::"core"."view_type_enum_old"');
        await queryRunner.query('ALTER TABLE "core"."view" ALTER COLUMN "type" SET DEFAULT \'TABLE\'');
        await queryRunner.query('DROP TYPE "core"."view_type_enum"');
        await queryRunner.query('ALTER TYPE "core"."view_type_enum_old" RENAME TO "view_type_enum"');
    }
};
AddListWidgetViewTypeFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.30.0', 1786227282471)
], AddListWidgetViewTypeFastInstanceCommand);

//# sourceMappingURL=2-30-instance-command-fast-1786227282471-add-list-widget-view-type.js.map