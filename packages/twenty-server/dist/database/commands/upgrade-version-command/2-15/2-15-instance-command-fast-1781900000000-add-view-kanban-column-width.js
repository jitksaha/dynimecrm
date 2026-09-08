"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddViewKanbanColumnWidthFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddViewKanbanColumnWidthFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddViewKanbanColumnWidthFastInstanceCommand = class AddViewKanbanColumnWidthFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."view" ADD COLUMN IF NOT EXISTS "kanbanColumnWidth" integer`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."view" DROP COLUMN IF EXISTS "kanbanColumnWidth"`);
    }
};
AddViewKanbanColumnWidthFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.15.0', 1781900000000)
], AddViewKanbanColumnWidthFastInstanceCommand);

//# sourceMappingURL=2-15-instance-command-fast-1781900000000-add-view-kanban-column-width.js.map