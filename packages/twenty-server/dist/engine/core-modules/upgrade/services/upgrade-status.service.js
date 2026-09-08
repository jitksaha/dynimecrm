"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpgradeStatusService", {
    enumerable: true,
    get: function() {
        return UpgradeStatusService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm = require("@nestjs/typeorm");
const _twentycrossupgradesupportedversionconstant = require("../constants/twenty-cross-upgrade-supported-version.constant");
const _upgrademigrationservice = require("./upgrade-migration.service");
const _upgradesequencereaderservice = require("./upgrade-sequence-reader.service");
const _upgradestatuscacheservice = require("./upgrade-status-cache.service");
const _advancethroughversionswithoutinstancecommandsutil = require("../utils/advance-through-versions-without-instance-commands.util");
const _extractversionfromcommandnameorthrowutil = require("../utils/extract-version-from-command-name-or-throw.util");
const _resolvecompletedversionfromcursorutil = require("../utils/resolve-completed-version-from-cursor.util");
const _activationstatusinutil = require("../../../../database/commands/command-runners/utils/activation-status-in.util");
const _workspaceentity = require("../../workspace/workspace.entity");
const _typeorm1 = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const deriveHealth = (cursor, lastExpectedCommandName)=>{
    if (cursor.status === 'failed') {
        return _types.UpgradeHealthEnum.FAILED;
    }
    if (lastExpectedCommandName !== null && cursor.name !== lastExpectedCommandName) {
        return _types.UpgradeHealthEnum.BEHIND;
    }
    return _types.UpgradeHealthEnum.UP_TO_DATE;
};
let UpgradeStatusService = class UpgradeStatusService {
    async getInstanceStatus() {
        const cursor = await this.upgradeMigrationService.getLastAttemptedInstanceCommand();
        const stepNames = this.upgradeSequenceReaderService.getUpgradeStepNames({
            'fast-instance': true,
            'slow-instance': true
        });
        const lastExpectedCommandName = stepNames[stepNames.length - 1] ?? null;
        return {
            ...this.buildCursorStatus(cursor, lastExpectedCommandName),
            inferredVersion: this.resolveInstanceCompletedVersion(cursor)
        };
    }
    async getInstanceCompletedVersion() {
        const cursor = await this.upgradeMigrationService.getLastAttemptedInstanceCommand();
        return this.resolveInstanceCompletedVersion(cursor);
    }
    async getWorkspaceStatuses(filterWorkspaceIds) {
        const workspaces = await this.loadProvisionedWorkspaces(filterWorkspaceIds);
        if (filterWorkspaceIds) {
            const foundIds = new Set(workspaces.map((workspace)=>workspace.id));
            for (const requestedId of filterWorkspaceIds){
                if (!foundIds.has(requestedId)) {
                    this.logger.warn(`Workspace ${requestedId} not found or not provisioned`);
                }
            }
        }
        const loadedWorkspaceIds = workspaces.map((workspace)=>workspace.id);
        const cursors = await this.upgradeMigrationService.getWorkspaceLastAttemptedCommandName(loadedWorkspaceIds);
        const stepNames = this.upgradeSequenceReaderService.getUpgradeStepNames();
        const lastExpectedCommandName = stepNames[stepNames.length - 1] ?? null;
        return workspaces.map((workspace)=>({
                ...this.buildCursorStatus(cursors.get(workspace.id) ?? null, lastExpectedCommandName),
                workspaceId: workspace.id,
                displayName: workspace.displayName ?? null
            }));
    }
    async getWorkspaceCompletedVersion(workspaceId) {
        const cursors = await this.upgradeMigrationService.getWorkspaceLastAttemptedCommandName([
            workspaceId
        ]);
        const cursor = cursors.get(workspaceId);
        if (!(0, _utils.isDefined)(cursor)) {
            return null;
        }
        return (0, _resolvecompletedversionfromcursorutil.resolveCompletedVersionFromCursor)({
            stepNames: this.upgradeSequenceReaderService.getUpgradeStepNames(),
            cursor
        });
    }
    async getInstanceAndWorkspaceCountsStatus() {
        const cachedStatus = await this.getCachedInstanceAndWorkspaceStatus();
        if (!(0, _utils.isDefined)(cachedStatus)) {
            const refreshedStatus = await this.refreshInstanceAndAllWorkspacesStatus();
            return {
                instanceUpgradeStatus: refreshedStatus.instanceUpgradeStatus,
                behindWorkspaceCount: refreshedStatus.workspacesBehind.length,
                failedWorkspaceCount: refreshedStatus.workspacesFailed.length,
                upToDateWorkspaceCount: refreshedStatus.upToDateWorkspaceCount,
                computedAt: refreshedStatus.computedAt
            };
        }
        return {
            instanceUpgradeStatus: cachedStatus.instanceUpgradeStatus,
            behindWorkspaceCount: cachedStatus.behindWorkspaceIds.length,
            failedWorkspaceCount: cachedStatus.failedWorkspaceIds.length,
            upToDateWorkspaceCount: cachedStatus.upToDateWorkspaceCount,
            computedAt: cachedStatus.computedAt
        };
    }
    async getInstanceAndAllWorkspacesStatus() {
        const cachedStatus = await this.getCachedInstanceAndWorkspaceStatus();
        if (!(0, _utils.isDefined)(cachedStatus)) {
            return this.refreshInstanceAndAllWorkspacesStatus();
        }
        const workspaceNamesById = await this.loadWorkspaceNamesById([
            ...cachedStatus.behindWorkspaceIds,
            ...cachedStatus.failedWorkspaceIds
        ]);
        return {
            instanceUpgradeStatus: cachedStatus.instanceUpgradeStatus,
            workspacesBehind: this.toWorkspaceRefs(cachedStatus.behindWorkspaceIds, workspaceNamesById),
            workspacesFailed: this.toWorkspaceRefs(cachedStatus.failedWorkspaceIds, workspaceNamesById),
            upToDateWorkspaceCount: cachedStatus.upToDateWorkspaceCount,
            computedAt: cachedStatus.computedAt
        };
    }
    async refreshInstanceAndAllWorkspacesStatus() {
        this.logger.log('Recomputing upgrade status for all workspaces');
        const [instanceUpgradeStatus, workspaceStatuses] = await Promise.all([
            this.getInstanceStatus(),
            this.getWorkspaceStatuses()
        ]);
        const workspacesBehind = [];
        const workspacesFailed = [];
        let upToDateWorkspaceCount = 0;
        for (const workspaceStatus of workspaceStatuses){
            const workspaceRef = {
                id: workspaceStatus.workspaceId,
                name: workspaceStatus.displayName
            };
            if (workspaceStatus.health === _types.UpgradeHealthEnum.BEHIND) {
                workspacesBehind.push(workspaceRef);
            } else if (workspaceStatus.health === _types.UpgradeHealthEnum.FAILED) {
                workspacesFailed.push(workspaceRef);
            } else if (workspaceStatus.health === _types.UpgradeHealthEnum.UP_TO_DATE) {
                upToDateWorkspaceCount++;
            }
        }
        const computedAt = new Date();
        await this.upgradeStatusCacheService.write({
            behindWorkspaceIds: workspacesBehind.map((workspace)=>workspace.id),
            failedWorkspaceIds: workspacesFailed.map((workspace)=>workspace.id),
            upToDateWorkspaceCount,
            computedAt
        });
        return {
            instanceUpgradeStatus,
            workspacesBehind,
            workspacesFailed,
            upToDateWorkspaceCount,
            computedAt
        };
    }
    async invalidateInstanceAndAllWorkspacesStatus() {
        await this.upgradeStatusCacheService.invalidate();
    }
    async getCachedInstanceAndWorkspaceStatus() {
        const computedAt = await this.upgradeStatusCacheService.getComputedAt();
        if (!(0, _utils.isDefined)(computedAt)) {
            return null;
        }
        const [instanceUpgradeStatus, behindWorkspaceIds, failedWorkspaceIds, upToDateWorkspaceCount] = await Promise.all([
            this.getInstanceStatus(),
            this.upgradeStatusCacheService.getBehindWorkspaceIds(),
            this.upgradeStatusCacheService.getFailedWorkspaceIds(),
            this.upgradeStatusCacheService.getUpToDateWorkspaceCount()
        ]);
        return {
            instanceUpgradeStatus,
            behindWorkspaceIds,
            failedWorkspaceIds,
            upToDateWorkspaceCount,
            computedAt
        };
    }
    resolveInstanceCompletedVersion(cursor) {
        if (!(0, _utils.isDefined)(cursor)) {
            return null;
        }
        const stepNames = this.upgradeSequenceReaderService.getUpgradeStepNames({
            'fast-instance': true,
            'slow-instance': true
        });
        const completedVersion = (0, _resolvecompletedversionfromcursorutil.resolveCompletedVersionFromCursor)({
            stepNames,
            cursor
        });
        if (!(0, _utils.isDefined)(completedVersion)) {
            return null;
        }
        return (0, _advancethroughversionswithoutinstancecommandsutil.advanceThroughVersionsWithoutInstanceCommands)({
            completedVersion,
            supportedVersions: _twentycrossupgradesupportedversionconstant.TWENTY_CROSS_UPGRADE_SUPPORTED_VERSIONS,
            versionsWithInstanceCommands: new Set(stepNames.map(_extractversionfromcommandnameorthrowutil.extractVersionFromCommandNameOrThrow))
        });
    }
    buildCursorStatus(cursor, lastExpectedCommandName) {
        if (!(0, _utils.isDefined)(cursor)) {
            return {
                inferredVersion: null,
                health: _types.UpgradeHealthEnum.BEHIND,
                latestCommand: null
            };
        }
        return {
            inferredVersion: (0, _extractversionfromcommandnameorthrowutil.extractVersionFromCommandNameOrThrow)(cursor.name),
            health: deriveHealth(cursor, lastExpectedCommandName),
            latestCommand: {
                name: cursor.name,
                status: cursor.status,
                executedByVersion: cursor.executedByVersion,
                errorMessage: cursor.errorMessage,
                createdAt: cursor.createdAt
            }
        };
    }
    async loadProvisionedWorkspaces(workspaceIds) {
        return this.workspaceRepository.find({
            select: [
                'id',
                'displayName'
            ],
            where: {
                ...workspaceIds && workspaceIds.length > 0 ? {
                    id: (0, _typeorm1.In)(workspaceIds)
                } : {},
                activationStatus: (0, _activationstatusinutil.activationStatusIn)(_workspace.PROVISIONED_WORKSPACE_ACTIVATION_STATUSES)
            },
            order: {
                id: 'ASC'
            }
        });
    }
    async loadWorkspaceNamesById(workspaceIds) {
        const namesById = new Map();
        if (workspaceIds.length === 0) {
            return namesById;
        }
        const workspaces = await this.workspaceRepository.find({
            select: [
                'id',
                'displayName'
            ],
            where: {
                id: (0, _typeorm1.In)(workspaceIds)
            }
        });
        for (const workspace of workspaces){
            if ((0, _utils.isDefined)(workspace)) {
                namesById.set(workspace.id, workspace.displayName ?? null);
            }
        }
        return namesById;
    }
    toWorkspaceRefs(workspaceIds, workspaceNamesById) {
        return workspaceIds.map((workspaceId)=>({
                id: workspaceId,
                name: workspaceNamesById.get(workspaceId) ?? null
            }));
    }
    constructor(upgradeMigrationService, upgradeSequenceReaderService, workspaceRepository, upgradeStatusCacheService){
        this.upgradeMigrationService = upgradeMigrationService;
        this.upgradeSequenceReaderService = upgradeSequenceReaderService;
        this.workspaceRepository = workspaceRepository;
        this.upgradeStatusCacheService = upgradeStatusCacheService;
        this.logger = new _common.Logger(UpgradeStatusService.name);
    }
};
UpgradeStatusService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _upgrademigrationservice.UpgradeMigrationService === "undefined" ? Object : _upgrademigrationservice.UpgradeMigrationService,
        typeof _upgradesequencereaderservice.UpgradeSequenceReaderService === "undefined" ? Object : _upgradesequencereaderservice.UpgradeSequenceReaderService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _upgradestatuscacheservice.UpgradeStatusCacheService === "undefined" ? Object : _upgradestatuscacheservice.UpgradeStatusCacheService
    ])
], UpgradeStatusService);

//# sourceMappingURL=upgrade-status.service.js.map