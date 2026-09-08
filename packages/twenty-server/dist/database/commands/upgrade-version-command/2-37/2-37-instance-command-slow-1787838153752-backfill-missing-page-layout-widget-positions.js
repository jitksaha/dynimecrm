"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillMissingPageLayoutWidgetPositionsSlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillMissingPageLayoutWidgetPositionsSlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BackfillMissingPageLayoutWidgetPositionsSlowInstanceCommand = class BackfillMissingPageLayoutWidgetPositionsSlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`
      WITH missing_positions AS (
        SELECT widget."id",
          CASE tab."layoutMode"
            WHEN 'CANVAS' THEN jsonb_build_object('layoutMode', 'CANVAS')
            WHEN 'VERTICAL_LIST' THEN jsonb_build_object(
              'layoutMode', 'VERTICAL_LIST',
              'index', COALESCE((
                SELECT MAX((existing."position"->>'index')::integer) + 1
                FROM "core"."pageLayoutWidget" existing
                WHERE existing."pageLayoutTabId" = widget."pageLayoutTabId"
                  AND existing."position"->>'layoutMode' = 'VERTICAL_LIST'
              ), 0) + ROW_NUMBER() OVER (
                PARTITION BY widget."pageLayoutTabId"
                ORDER BY (widget."gridPosition"->>'row')::integer,
                  (widget."gridPosition"->>'column')::integer,
                  widget."createdAt", widget."id"
              ) - 1
            )
            ELSE COALESCE(
              widget."gridPosition",
              '{"row": 0, "column": 0, "rowSpan": 1, "columnSpan": 12}'::jsonb
            ) || jsonb_build_object('layoutMode', 'GRID')
          END AS "position"
        FROM "core"."pageLayoutWidget" widget
        JOIN "core"."pageLayoutTab" tab ON tab."id" = widget."pageLayoutTabId"
        WHERE widget."position" IS NULL
      )
      UPDATE "core"."pageLayoutWidget" widget
      SET "position" = missing_positions."position"
      FROM missing_positions
      WHERE widget."id" = missing_positions."id"
    `);
    }
    async up(_queryRunner) {
        return;
    }
    async down(_queryRunner) {
        return;
    }
};
BackfillMissingPageLayoutWidgetPositionsSlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.37.0', 1787838153752, {
        type: 'slow'
    })
], BackfillMissingPageLayoutWidgetPositionsSlowInstanceCommand);

//# sourceMappingURL=2-37-instance-command-slow-1787838153752-backfill-missing-page-layout-widget-positions.js.map