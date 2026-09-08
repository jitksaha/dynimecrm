"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddPageLayoutCascadeDeleteIndexesFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddPageLayoutCascadeDeleteIndexesFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const PAGE_LAYOUT_TAB_PAGE_LAYOUT_ID_INDEX_NAME = 'IDX_PAGE_LAYOUT_TAB_PAGE_LAYOUT_ID';
const PAGE_LAYOUT_WIDGET_PAGE_LAYOUT_TAB_ID_INDEX_NAME = 'IDX_PAGE_LAYOUT_WIDGET_PAGE_LAYOUT_TAB_ID';
let AddPageLayoutCascadeDeleteIndexesFastInstanceCommand = class AddPageLayoutCascadeDeleteIndexesFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "${PAGE_LAYOUT_TAB_PAGE_LAYOUT_ID_INDEX_NAME}" ON "core"."pageLayoutTab" ("pageLayoutId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "${PAGE_LAYOUT_WIDGET_PAGE_LAYOUT_TAB_ID_INDEX_NAME}" ON "core"."pageLayoutWidget" ("pageLayoutTabId")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "core"."${PAGE_LAYOUT_WIDGET_PAGE_LAYOUT_TAB_ID_INDEX_NAME}"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "core"."${PAGE_LAYOUT_TAB_PAGE_LAYOUT_ID_INDEX_NAME}"`);
    }
};
AddPageLayoutCascadeDeleteIndexesFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.25.0', 1784904030251)
], AddPageLayoutCascadeDeleteIndexesFastInstanceCommand);

//# sourceMappingURL=2-25-instance-command-fast-1784904030251-add-page-layout-cascade-delete-indexes.js.map