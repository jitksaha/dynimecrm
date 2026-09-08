"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpgradePeopleDataLabsApplicationCommand", {
    enumerable: true,
    get: function() {
        return UpgradePeopleDataLabsApplicationCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _semver = /*#__PURE__*/ _interop_require_wildcard(require("semver"));
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _ensureapplicationregistrationlogofileidcolumnutil = require("./utils/ensure-application-registration-logo-file-id-column.util");
const _applicationupgradeservice = require("../../../../engine/core-modules/application/application-upgrade/application-upgrade.service");
const _applicationentity = require("../../../../engine/core-modules/application/application.entity");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
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
// packages/twenty-apps/public/people-data-labs APPLICATION_UNIVERSAL_IDENTIFIER
const PEOPLE_DATA_LABS_APPLICATION_UNIVERSAL_IDENTIFIER = '4a1178c1-3535-4a47-b592-231d3216b36f';
// First version whose views pin the re-derived name-free system relation
// field universal identifiers (introduced in 1.0.7) AND whose front components
// bundle React 19 to match the twenty-sdk runtime (fixed in 1.0.9).
const PEOPLE_DATA_LABS_TARGET_VERSION = '1.0.9';
let UpgradePeopleDataLabsApplicationCommand = class UpgradePeopleDataLabsApplicationCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        // The 2.21 logoFileId command was skipped on instances that ran a 2.21
        // binary, so the column is absent and the findOne below crashes on it.
        // Repair it here since this is the command that breaks.
        if (!this.hasEnsuredLogoFileIdColumn) {
            if (isDryRun) {
                const columnExists = await this.logoFileIdColumnExists();
                if (!columnExists) {
                    this.logger.log('Would repair the missing core."applicationRegistration"."logoFileId" column');
                    return;
                }
            } else {
                await (0, _ensureapplicationregistrationlogofileidcolumnutil.ensureApplicationRegistrationLogoFileIdColumn)((sql)=>this.coreDataSource.query(sql));
                this.hasEnsuredLogoFileIdColumn = true;
            }
        }
        const application = await this.applicationRepository.findOne({
            where: {
                workspaceId,
                universalIdentifier: PEOPLE_DATA_LABS_APPLICATION_UNIVERSAL_IDENTIFIER
            },
            relations: [
                'applicationRegistration'
            ]
        });
        if (!(0, _utils.isDefined)(application)) {
            return;
        }
        const applicationRegistration = application.applicationRegistration;
        if (!(0, _utils.isDefined)(applicationRegistration)) {
            this.logger.warn(`people-data-labs is installed but has no application registration, skipping upgrade for workspace ${workspaceId}`);
            return;
        }
        const installedVersion = _semver.valid(application.version);
        if ((0, _utils.isDefined)(installedVersion) && _semver.gte(installedVersion, PEOPLE_DATA_LABS_TARGET_VERSION)) {
            return;
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would upgrade people-data-labs from ${application.version} to ${PEOPLE_DATA_LABS_TARGET_VERSION} for workspace ${workspaceId}`);
            return;
        }
        try {
            await this.applicationUpgradeService.upgradeApplication({
                appRegistrationId: applicationRegistration.id,
                targetVersion: PEOPLE_DATA_LABS_TARGET_VERSION,
                workspaceId,
                // 1.0.9 pins engines.twenty >=2.23.0, but this command runs as part of
                // the 2.23 workspace upgrade itself, so the workspace has not yet been
                // marked as completing 2.23 and the compatibility check would reject
                // the install. The server is already on 2.23, so skip the check here.
                skipWorkspaceCompatibilityCheck: true
            });
            this.logger.log(`Upgraded people-data-labs from ${application.version} to ${PEOPLE_DATA_LABS_TARGET_VERSION} for workspace ${workspaceId}`);
        } catch (error) {
            // Non-fatal: the app stays functional at runtime (view fields reference
            // fields by database id); only a manifest re-sync of the stale version
            // would fail, and the upgrade can be retried from the UI.
            this.logger.error(`Failed to upgrade people-data-labs for workspace ${workspaceId}: ${error}`);
        }
    }
    async logoFileIdColumnExists() {
        // pg_attribute scoped to the single table, not the instance-wide
        // information_schema.columns view, which is slow on many-tenant instances.
        const rows = await this.coreDataSource.query(`SELECT EXISTS (
        SELECT 1 FROM pg_attribute
        WHERE attrelid = to_regclass('core."applicationRegistration"')
          AND attname = 'logoFileId'
          AND NOT attisdropped
      ) AS "exists"`);
        return rows[0]?.exists === true;
    }
    constructor(workspaceIteratorService, applicationUpgradeService, applicationRepository, coreDataSource){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationUpgradeService = applicationUpgradeService, this.applicationRepository = applicationRepository, this.coreDataSource = coreDataSource, // Instance-global DDL: run once per process, not per workspace.
        this.hasEnsuredLogoFileIdColumn = false;
    }
};
UpgradePeopleDataLabsApplicationCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.23.0', 1784565137000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-23:upgrade-people-data-labs-application',
        description: 'Upgrade the people-data-labs application to 1.0.9 right after the system relation field universal identifier backfill, so its views reference the re-derived name-free identifiers instead of the stale pre-2.23 ones and its front components run on React 19. Workspaces already at or above 1.0.9 are left untouched.'
    }),
    _ts_param(2, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_param(3, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationupgradeservice.ApplicationUpgradeService === "undefined" ? Object : _applicationupgradeservice.ApplicationUpgradeService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource
    ])
], UpgradePeopleDataLabsApplicationCommand);

//# sourceMappingURL=2-23-workspace-command-1784565137000-upgrade-people-data-labs-application.command.js.map