"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpgradeApplicationCommand", {
    enumerable: true,
    get: function() {
        return UpgradeApplicationCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _chalk = /*#__PURE__*/ _interop_require_default(require("chalk"));
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _logger = require("../../../../../database/commands/logger");
const _askcommandconfirmationutil = require("../../../../../database/commands/utils/ask-command-confirmation.util");
const _parseboundedpositiveintegerutil = require("../../../../../database/commands/utils/parse-bounded-positive-integer.util");
const _applicationregistrationentity = require("../../application-registration/application-registration.entity");
const _applicationupgradeservice = require("../application-upgrade.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
const MAX_WORKSPACE_COUNT_LIMIT = 50;
let UpgradeApplicationCommand = class UpgradeApplicationCommand extends _nestcommander.CommandRunner {
    parseApplicationRegistrationUniversalIdentifier(value) {
        return value;
    }
    parseWorkspaceId(value, previous) {
        const accumulator = previous ?? new Set();
        accumulator.add(value);
        return accumulator;
    }
    parseWorkspaceCountLimit(value) {
        return (0, _parseboundedpositiveintegerutil.parseBoundedPositiveInteger)(value, 'workspace count limit', MAX_WORKSPACE_COUNT_LIMIT);
    }
    parseDryRun() {
        return true;
    }
    parseYes() {
        return true;
    }
    async run(_passedParams, options) {
        const registration = await this.applicationRegistrationRepository.findOne({
            where: {
                universalIdentifier: options.applicationRegistrationUniversalIdentifier
            }
        });
        if (!(0, _utils.isDefined)(registration)) {
            throw new Error(`Application registration with universal identifier ${options.applicationRegistrationUniversalIdentifier} not found`);
        }
        const workspaceIds = (0, _utils.isDefined)(options.workspaceId) ? Array.from(options.workspaceId) : undefined;
        const { appRegistration, targetVersion, applicationsToUpgrade, skippedNonProvisionedWorkspaceIds } = await this.applicationUpgradeService.findApplicationsToUpgrade({
            applicationRegistrationId: registration.id,
            onlyAutoUpgrade: false,
            workspaceIds,
            workspaceCountLimit: options.workspaceCountLimit
        });
        if (!(0, _utils.isDefined)(targetVersion)) {
            this.logger.warn(`Application "${registration.name}" (${registration.universalIdentifier}) has no latest available version, nothing to upgrade`);
            return;
        }
        if (skippedNonProvisionedWorkspaceIds.length > 0) {
            this.logger.warn(`Skipping ${skippedNonProvisionedWorkspaceIds.length} non provisioned workspace(s): ${skippedNonProvisionedWorkspaceIds.join(', ')}`);
        }
        const impactedWorkspaceIds = applicationsToUpgrade.map((application)=>application.workspaceId);
        if (options.dryRun ?? false) {
            this.logger.log(`[DRY RUN] Would upgrade "${registration.name}" (${registration.universalIdentifier}) to version ${targetVersion} on ${impactedWorkspaceIds.length} workspace(s)${impactedWorkspaceIds.length > 0 ? `: ${impactedWorkspaceIds.join(', ')}` : ''}`);
            return;
        }
        if (impactedWorkspaceIds.length === 0) {
            this.logger.log(`No workspace to upgrade, every targeted installation of "${registration.name}" already runs version ${targetVersion}`);
            return;
        }
        if (!(options.yes ?? false)) {
            const confirmationTarget = (0, _utils.isDefined)(workspaceIds) ? `workspace(s) ${workspaceIds.join(', ')}` : `${impactedWorkspaceIds.length} workspace(s)`;
            const isConfirmed = await (0, _askcommandconfirmationutil.askCommandConfirmation)(`Confirm upgrading application ${registration.universalIdentifier} to version ${targetVersion} on ${confirmationTarget}`);
            if (!isConfirmed) {
                this.logger.log('Aborted, no upgrade performed');
                return;
            }
        }
        this.logger.log(`Upgrading "${registration.name}" (${registration.universalIdentifier}) to version ${targetVersion} on ${impactedWorkspaceIds.length} workspace(s)...`);
        // Runs on the exact set shown at confirmation time, so installations
        // created or versions published while the operator answered are excluded.
        const report = await this.applicationUpgradeService.upgradeApplications({
            appRegistration,
            targetVersion,
            applications: applicationsToUpgrade
        });
        this.logger.log(`Upgraded ${report.success.length} workspace(s), ${report.fail.length} failed`);
        this.logger.log(_chalk.default.blue('Command completed!'));
    }
    constructor(applicationRegistrationRepository, applicationUpgradeService){
        super(), this.applicationRegistrationRepository = applicationRegistrationRepository, this.applicationUpgradeService = applicationUpgradeService;
        this.logger = new _logger.CommandLogger({
            verbose: false,
            constructorName: this.constructor.name
        });
    }
};
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '-u, --application-registration-universal-identifier <application_registration_universal_identifier>',
        description: 'Application registration universal identifier',
        required: true
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", String)
], UpgradeApplicationCommand.prototype, "parseApplicationRegistrationUniversalIdentifier", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '-w, --workspace-id <workspace_id>',
        description: 'Only upgrade the given workspace id. Can be repeated to target several workspaces. Upgrades all workspaces if not provided.',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Set === "undefined" ? Object : Set
    ]),
    _ts_metadata("design:returntype", typeof Set === "undefined" ? Object : Set)
], UpgradeApplicationCommand.prototype, "parseWorkspaceId", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '--workspace-count-limit <count>',
        description: `Limit the number of workspaces to upgrade (max ${MAX_WORKSPACE_COUNT_LIMIT})`,
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Number)
], UpgradeApplicationCommand.prototype, "parseWorkspaceCountLimit", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '-d, --dry-run',
        description: 'List the workspaces that would be upgraded without upgrading',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Boolean)
], UpgradeApplicationCommand.prototype, "parseDryRun", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '-y, --yes',
        description: 'Skip the confirmation prompt (for non-interactive usage)',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Boolean)
], UpgradeApplicationCommand.prototype, "parseYes", null);
UpgradeApplicationCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'application:upgrade',
        description: 'Upgrade an application to its latest available version on every workspace that already has it installed'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _applicationupgradeservice.ApplicationUpgradeService === "undefined" ? Object : _applicationupgradeservice.ApplicationUpgradeService
    ])
], UpgradeApplicationCommand);

//# sourceMappingURL=upgrade-application.command.js.map