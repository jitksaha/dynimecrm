"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SetTableWidgetViewsVisibilityToWorkspaceSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return SetTableWidgetViewsVisibilityToWorkspaceSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let SetTableWidgetViewsVisibilityToWorkspaceSlowInstanceCommand = class SetTableWidgetViewsVisibilityToWorkspaceSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`UPDATE "core"."view"
          SET "visibility" = 'WORKSPACE'
        WHERE "type" = 'TABLE_WIDGET'
          AND "visibility" = 'UNLISTED'`);
    }
    async up(_queryRunner) {}
    async down(_queryRunner) {}
};
SetTableWidgetViewsVisibilityToWorkspaceSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.14.0', 1781515653781, {
        type: 'slow'
    })
], SetTableWidgetViewsVisibilityToWorkspaceSlowInstanceCommand);

//# sourceMappingURL=2-14-instance-command-slow-1781515653781-set-table-widget-views-visibility-to-workspace.js.map