"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillLinkedTimelineActivityHappensAtCommand", {
    enumerable: true,
    get: function() {
        return BackfillLinkedTimelineActivityHappensAtCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildlinkedtimelineactivityhappensatbackfillqueriesutil = require("./utils/build-linked-timeline-activity-happens-at-backfill-queries.util");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const BACKFILL_BATCH_SIZE = 5_000;
let BackfillLinkedTimelineActivityHappensAtCommand = class BackfillLinkedTimelineActivityHappensAtCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options, dataSource }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.warn(`Skipping linked timeline activity happensAt backfill for workspace ${workspaceId}: no workspace data source`);
            return;
        }
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const [workspaceTables] = await dataSource.query(`SELECT
        to_regclass($1) AS "timelineActivity",
        to_regclass($2) AS "message",
        to_regclass($3) AS "calendarEvent"`, [
            `"${schemaName}"."timelineActivity"`,
            `"${schemaName}"."message"`,
            `"${schemaName}"."calendarEvent"`
        ]);
        if (!(0, _utils.isDefined)(workspaceTables?.timelineActivity) || !(0, _utils.isDefined)(workspaceTables.message) || !(0, _utils.isDefined)(workspaceTables.calendarEvent)) {
            this.logger.warn(`Skipping linked timeline activity happensAt backfill for workspace ${workspaceId}: tables are not provisioned`);
            return;
        }
        const { flatTimelineActivityTypeMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatTimelineActivityTypeMaps'
        ]);
        const queries = (0, _buildlinkedtimelineactivityhappensatbackfillqueriesutil.buildLinkedTimelineActivityHappensAtBackfillQueries)({
            schemaName,
            batchSize: BACKFILL_BATCH_SIZE,
            flatTimelineActivityTypes: Object.values(flatTimelineActivityTypeMaps.byUniversalIdentifier).filter(_utils.isDefined)
        });
        if (options.dryRun) {
            for (const query of queries){
                const [result] = await dataSource.query(query.countSql, query.parameters);
                this.logger.log(`[DRY RUN] Would rewrite happensAt on ${result?.count ?? 0} ${query.label} for workspace ${workspaceId}`);
            }
            return;
        }
        for (const query of queries){
            let backfilledRowCount = 0;
            let lastBatchRowCount = 0;
            // Each batch commits on its own and only ever picks rows still diverging
            // from their source timestamp, so an interrupted run resumes cleanly.
            do {
                const result = await dataSource.query(query.updateSql, query.parameters);
                lastBatchRowCount = result?.[1] ?? 0;
                backfilledRowCount += lastBatchRowCount;
            }while (lastBatchRowCount === BACKFILL_BATCH_SIZE)
            this.logger.log(`Rewrote happensAt on ${backfilledRowCount} ${query.label} for workspace ${workspaceId}`);
        }
    }
    constructor(workspaceIteratorService, workspaceCacheService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.workspaceCacheService = workspaceCacheService;
    }
};
BackfillLinkedTimelineActivityHappensAtCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.38.0', 1787914663665),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-38:backfill-linked-timeline-activity-happens-at',
        description: 'Backfill timelineActivity.happensAt for message and calendar event linked activities from message.receivedAt and calendarEvent.startsAt'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], BackfillLinkedTimelineActivityHappensAtCommand);

//# sourceMappingURL=2-38-workspace-command-1787914663665-backfill-linked-timeline-activity-happens-at.command.js.map