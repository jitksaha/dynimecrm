"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillMessageCalendarTargetsCommand", {
    enumerable: true,
    get: function() {
        return BackfillMessageCalendarTargetsCommand;
    }
});
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _buildmessagecalendartargetbackfillqueriesutil = require("./utils/build-message-calendar-target-backfill-queries.util");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _messagecalendartargetmigrationconstants = require("../../../../engine/core-modules/target/constants/message-calendar-target-migration.constants");
const _getworkspaceschemanameutil = require("../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
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
let BackfillMessageCalendarTargetsCommand = class BackfillMessageCalendarTargetsCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options, dataSource }) {
        if (!(0, _utils.isDefined)(dataSource)) {
            this.logger.warn(`Skipping message and calendar target backfill for workspace ${workspaceId}: no workspace data source`);
            return;
        }
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const [targetTables] = await dataSource.query(`SELECT
        to_regclass($1) AS "calendarEventTarget",
        to_regclass($2) AS "messageThreadTarget"`, [
            `"${schemaName}"."calendarEventTarget"`,
            `"${schemaName}"."messageThreadTarget"`
        ]);
        if (!(0, _utils.isDefined)(targetTables?.calendarEventTarget) || !(0, _utils.isDefined)(targetTables.messageThreadTarget)) {
            this.logger.warn(`Skipping message and calendar target backfill for workspace ${workspaceId}: target tables are not provisioned`);
            return;
        }
        const queries = (0, _buildmessagecalendartargetbackfillqueriesutil.buildMessageCalendarTargetBackfillQueries)({
            batchSize: BACKFILL_BATCH_SIZE,
            schemaName
        });
        if (options.dryRun) {
            for (const query of queries){
                const [result] = await dataSource.query(query.countSql);
                this.logger.log(`[DRY RUN] Would create ${result?.count ?? 0} ${query.label} for workspace ${workspaceId}`);
            }
            return;
        }
        for (const query of queries){
            let candidateCount = 0;
            let totalInsertedCount = 0;
            do {
                const [result] = await dataSource.query(query.insertSql);
                candidateCount = result?.candidateCount ?? 0;
                totalInsertedCount += result?.insertedCount ?? 0;
            }while (candidateCount === BACKFILL_BATCH_SIZE)
            this.logger.log(`Created ${totalInsertedCount} ${query.label} for workspace ${workspaceId}`);
        }
    }
    constructor(workspaceIteratorService){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService;
    }
};
BackfillMessageCalendarTargetsCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)(_messagecalendartargetmigrationconstants.MESSAGE_CALENDAR_TARGET_MIGRATION_VERSION, _messagecalendartargetmigrationconstants.MESSAGE_CALENDAR_TARGET_BACKFILL_TIMESTAMP),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-37:backfill-message-calendar-targets',
        description: 'Backfill message and calendar target junctions without emitting record events'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService
    ])
], BackfillMessageCalendarTargetsCommand);

//# sourceMappingURL=2-37-workspace-command-1787832413051-backfill-message-calendar-targets.command.js.map