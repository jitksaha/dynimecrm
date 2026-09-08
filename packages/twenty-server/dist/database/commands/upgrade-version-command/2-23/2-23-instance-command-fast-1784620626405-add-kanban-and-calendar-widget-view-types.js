"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddKanbanAndCalendarWidgetViewTypesFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddKanbanAndCalendarWidgetViewTypesFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddKanbanAndCalendarWidgetViewTypesFastInstanceCommand = class AddKanbanAndCalendarWidgetViewTypesFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TYPE "core"."view_type_enum" ADD VALUE IF NOT EXISTS 'KANBAN_WIDGET' AFTER 'TABLE_WIDGET'`);
        await queryRunner.query(`ALTER TYPE "core"."view_type_enum" ADD VALUE IF NOT EXISTS 'CALENDAR_WIDGET' AFTER 'KANBAN_WIDGET'`);
    }
    async down(queryRunner) {
        await queryRunner.query("CREATE TYPE \"core\".\"view_type_enum_old\" AS ENUM('TABLE', 'KANBAN', 'CALENDAR', 'FIELDS_WIDGET', 'TABLE_WIDGET')");
        await queryRunner.query('ALTER TABLE "core"."view" ALTER COLUMN "type" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "core"."view" ALTER COLUMN "type" TYPE "core"."view_type_enum_old" USING "type"::"text"::"core"."view_type_enum_old"');
        await queryRunner.query('ALTER TABLE "core"."view" ALTER COLUMN "type" SET DEFAULT \'TABLE\'');
        await queryRunner.query('DROP TYPE "core"."view_type_enum"');
        await queryRunner.query('ALTER TYPE "core"."view_type_enum_old" RENAME TO "view_type_enum"');
    }
};
AddKanbanAndCalendarWidgetViewTypesFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.23.0', 1784620626405)
], AddKanbanAndCalendarWidgetViewTypesFastInstanceCommand);

//# sourceMappingURL=2-23-instance-command-fast-1784620626405-add-kanban-and-calendar-widget-view-types.js.map