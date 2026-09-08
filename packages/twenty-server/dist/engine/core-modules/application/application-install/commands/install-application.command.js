"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InstallApplicationCommand", {
    enumerable: true,
    get: function() {
        return InstallApplicationCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _chalk = /*#__PURE__*/ _interop_require_default(require("chalk"));
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _workspaceiteratorservice = require("../../../../../database/commands/command-runners/workspace-iterator.service");
const _logger = require("../../../../../database/commands/logger");
const _askcommandconfirmationutil = require("../../../../../database/commands/utils/ask-command-confirmation.util");
const _parseboundedpositiveintegerutil = require("../../../../../database/commands/utils/parse-bounded-positive-integer.util");
const _applicationinstallservice = require("../application-install.service");
const _applicationregistrationentity = require("../../application-registration/application-registration.entity");
const _applicationregistrationsourcetypeenum = require("../../application-registration/enums/application-registration-source-type.enum");
const _applicationentity = require("../../application.entity");
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
let InstallApplicationCommand = class InstallApplicationCommand extends _nestcommander.CommandRunner {
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
        if (registration.sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL || registration.sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.OAUTH_ONLY) {
            throw new Error(`Cannot install application ${registration.universalIdentifier}: applications with source type ${registration.sourceType} have no code artifacts to install`);
        }
        const targetVersion = registration.latestAvailableVersion;
        const versionLabel = targetVersion ?? 'latest available';
        const isDryRun = options.dryRun ?? false;
        const requestedWorkspaceIds = (0, _utils.isDefined)(options.workspaceId) ? Array.from(options.workspaceId) : undefined;
        // Explicit ids bypass the iterator's own workspace selection, so the count
        // limit and the already-installed filter are applied here instead.
        const alreadyInstalledRequestedWorkspaceIds = (0, _utils.isDefined)(requestedWorkspaceIds) ? await this.findAlreadyInstalledWorkspaceIds({
            universalIdentifier: registration.universalIdentifier,
            workspaceIds: requestedWorkspaceIds
        }) : undefined;
        const workspaceIdsToIterate = (0, _utils.isDefined)(requestedWorkspaceIds) ? requestedWorkspaceIds.filter((workspaceId)=>!alreadyInstalledRequestedWorkspaceIds?.has(workspaceId)).slice(0, options.workspaceCountLimit) : undefined;
        if ((0, _utils.isDefined)(workspaceIdsToIterate) && workspaceIdsToIterate.length === 0) {
            this.logger.log(`No workspace to install, every targeted workspace already has "${registration.name}" installed`);
            return;
        }
        if (!isDryRun && !(options.yes ?? false)) {
            const isConfirmed = await (0, _askcommandconfirmationutil.askCommandConfirmation)(`Confirm installing application ${registration.universalIdentifier} version ${versionLabel} on ${this.describeConfirmationTarget({
                workspaceIdsToIterate,
                workspaceCountLimit: options.workspaceCountLimit
            })}`);
            if (!isConfirmed) {
                this.logger.log('Aborted, no installation performed');
                return;
            }
        }
        let skippedWorkspaceCount = 0;
        const prefilteredWorkspaceCount = alreadyInstalledRequestedWorkspaceIds?.size ?? 0;
        const report = await this.workspaceIteratorService.iterate({
            workspaceIds: workspaceIdsToIterate,
            workspaceCountLimit: (0, _utils.isDefined)(workspaceIdsToIterate) ? undefined : options.workspaceCountLimit,
            dryRun: isDryRun,
            callback: async ({ workspaceId })=>{
                if (await this.isApplicationInstalled({
                    universalIdentifier: registration.universalIdentifier,
                    workspaceId
                })) {
                    skippedWorkspaceCount += 1;
                    this.logger.log(`Skipping workspace ${workspaceId}: "${registration.name}" is already installed, run application:upgrade to update it`);
                    return;
                }
                if (isDryRun) {
                    this.logger.log(`[DRY RUN] Would install "${registration.name}" (${registration.universalIdentifier}) version ${versionLabel} on workspace ${workspaceId}`);
                    return;
                }
                await this.applicationInstallService.installApplication({
                    appRegistrationId: registration.id,
                    version: targetVersion ?? undefined,
                    workspaceId
                });
            }
        });
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Installed on ${report.success.length - skippedWorkspaceCount} workspace(s), skipped ${skippedWorkspaceCount + prefilteredWorkspaceCount} already installed, ${report.fail.length} failed`);
        this.logger.log(_chalk.default.blue('Command completed!'));
    }
    describeConfirmationTarget({ workspaceIdsToIterate, workspaceCountLimit }) {
        if ((0, _utils.isDefined)(workspaceIdsToIterate)) {
            return `workspace(s) ${workspaceIdsToIterate.join(', ')}`;
        }
        return (0, _utils.isDefined)(workspaceCountLimit) ? `up to ${workspaceCountLimit} provisioned workspace(s) that do not have it yet` : 'every provisioned workspace that does not have it yet';
    }
    async findAlreadyInstalledWorkspaceIds({ universalIdentifier, workspaceIds }) {
        const existingApplications = await this.applicationRepository.find({
            select: [
                'workspaceId'
            ],
            where: {
                universalIdentifier,
                workspaceId: (0, _typeorm1.In)(workspaceIds)
            }
        });
        return new Set(existingApplications.map((application)=>application.workspaceId));
    }
    // Matches on the universal identifier, the same identity
    // ApplicationInstallService uses to decide between a fresh install and a
    // version upgrade, so a row with a stale registration id is not mistaken
    // for a missing installation.
    async isApplicationInstalled({ universalIdentifier, workspaceId }) {
        return this.applicationRepository.exists({
            where: {
                universalIdentifier,
                workspaceId
            }
        });
    }
    constructor(applicationRegistrationRepository, applicationRepository, applicationInstallService, workspaceIteratorService){
        super(), this.applicationRegistrationRepository = applicationRegistrationRepository, this.applicationRepository = applicationRepository, this.applicationInstallService = applicationInstallService, this.workspaceIteratorService = workspaceIteratorService;
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
], InstallApplicationCommand.prototype, "parseApplicationRegistrationUniversalIdentifier", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '-w, --workspace-id <workspace_id>',
        description: 'Only install on the given workspace id. Can be repeated to target several workspaces. Targets all provisioned workspaces if not provided.',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Set === "undefined" ? Object : Set
    ]),
    _ts_metadata("design:returntype", typeof Set === "undefined" ? Object : Set)
], InstallApplicationCommand.prototype, "parseWorkspaceId", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '--workspace-count-limit <count>',
        description: `Limit the number of workspaces to iterate over (max ${MAX_WORKSPACE_COUNT_LIMIT})`,
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Number)
], InstallApplicationCommand.prototype, "parseWorkspaceCountLimit", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '-d, --dry-run',
        description: 'List the workspaces that would be installed without installing',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Boolean)
], InstallApplicationCommand.prototype, "parseDryRun", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '-y, --yes',
        description: 'Skip the confirmation prompt (for non-interactive usage)',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Boolean)
], InstallApplicationCommand.prototype, "parseYes", null);
InstallApplicationCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'application:install',
        description: 'Install an application on every workspace that does not have it yet. Workspaces where it is already installed are left untouched, use application:upgrade for those'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _applicationinstallservice.ApplicationInstallService === "undefined" ? Object : _applicationinstallservice.ApplicationInstallService,
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService
    ])
], InstallApplicationCommand);

//# sourceMappingURL=install-application.command.js.map