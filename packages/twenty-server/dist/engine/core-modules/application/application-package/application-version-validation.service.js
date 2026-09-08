"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationVersionValidationService", {
    enumerable: true,
    get: function() {
        return ApplicationVersionValidationService;
    }
});
const _common = require("@nestjs/common");
const _semver = /*#__PURE__*/ _interop_require_default(require("semver"));
const _upgradestatusservice = require("../../upgrade/services/upgrade-status.service");
const _utils = require("twenty-shared/utils");
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
let ApplicationVersionValidationService = class ApplicationVersionValidationService {
    async validateServerCompatibility(requiredServerVersion) {
        if (!(0, _utils.isDefined)(requiredServerVersion)) {
            return {
                compatible: true
            };
        }
        if (!(0, _utils.isDefined)(_semver.default.validRange(requiredServerVersion))) {
            return {
                compatible: false,
                reason: 'INVALID_REQUIRED_VERSION',
                message: `App manifest declares invalid engines.twenty value "${requiredServerVersion}". Must be a valid semver range.`
            };
        }
        const instanceCompletedVersion = await this.upgradeStatusService.getInstanceCompletedVersion();
        return this.validateVersionAgainstRange({
            version: instanceCompletedVersion,
            requiredVersionRange: requiredServerVersion,
            scope: 'instance'
        });
    }
    async validateWorkspaceCompatibility({ requiredServerVersion, workspaceId }) {
        if (!(0, _utils.isDefined)(requiredServerVersion)) {
            return {
                compatible: true
            };
        }
        if (!(0, _utils.isDefined)(_semver.default.validRange(requiredServerVersion))) {
            return {
                compatible: false,
                reason: 'INVALID_REQUIRED_VERSION',
                message: `App manifest declares invalid engines.twenty value "${requiredServerVersion}". Must be a valid semver range.`
            };
        }
        const workspaceCompletedVersion = await this.upgradeStatusService.getWorkspaceCompletedVersion(workspaceId);
        if (!(0, _utils.isDefined)(workspaceCompletedVersion)) {
            return {
                compatible: false,
                reason: 'INVALID_WORKSPACE_VERSION',
                message: `Cannot determine the completed upgrade version for workspace ${workspaceId}: no interpretable upgrade cursor found.`
            };
        }
        return this.validateVersionAgainstRange({
            version: workspaceCompletedVersion,
            requiredVersionRange: requiredServerVersion,
            scope: 'workspace'
        });
    }
    // A current version that is not valid semver never blocks: there is
    // nothing reliable to compare against.
    validateVersionProgression({ incomingVersion, currentVersion, universalIdentifier, action }) {
        if (!(0, _utils.isDefined)(_semver.default.valid(incomingVersion))) {
            return {
                allowed: false,
                reason: 'INVALID_INCOMING_VERSION',
                message: `Invalid version "${incomingVersion}" in package.json. Must be a valid semver version.`
            };
        }
        if (!(0, _utils.isDefined)(_semver.default.valid(currentVersion))) {
            return {
                allowed: true
            };
        }
        if (action === 'deploy' && _semver.default.lte(incomingVersion, currentVersion)) {
            return {
                allowed: false,
                reason: _semver.default.eq(incomingVersion, currentVersion) ? 'SAME_VERSION' : 'DOWNGRADE',
                message: `Cannot deploy ${universalIdentifier}@${incomingVersion}: version must be higher than the currently deployed version ${currentVersion}. Please bump the version in package.json.`
            };
        }
        if (action === 'install' && _semver.default.eq(incomingVersion, currentVersion)) {
            return {
                allowed: false,
                reason: 'SAME_VERSION',
                message: `${universalIdentifier}@${incomingVersion} is already installed in this workspace.`
            };
        }
        if (action === 'install' && _semver.default.lt(incomingVersion, currentVersion)) {
            return {
                allowed: false,
                reason: 'DOWNGRADE',
                message: `Cannot install ${universalIdentifier}@${incomingVersion}: version ${currentVersion} is already installed and downgrading is not allowed.`
            };
        }
        return {
            allowed: true
        };
    }
    validateVersionAgainstRange({ version, requiredVersionRange, scope }) {
        if (!(0, _utils.isDefined)(version) || !(0, _utils.isDefined)(_semver.default.valid(version))) {
            return scope === 'workspace' ? {
                compatible: false,
                reason: 'INVALID_WORKSPACE_VERSION',
                message: `Cannot verify workspace compatibility: workspace completed version "${version ?? 'undefined'}" is not a valid semver version.`
            } : {
                compatible: false,
                reason: 'INVALID_SERVER_VERSION',
                message: `Cannot verify server compatibility: inferred server version "${version ?? 'undefined'}" is not a valid semver version.`
            };
        }
        if (!_semver.default.satisfies(version, requiredVersionRange)) {
            return scope === 'workspace' ? {
                compatible: false,
                reason: 'WORKSPACE_INCOMPATIBLE',
                message: `App requires Twenty server ${requiredVersionRange} but this workspace has only completed the upgrade to ${version}.`
            } : {
                compatible: false,
                reason: 'INSTANCE_INCOMPATIBLE',
                message: `App requires Twenty server ${requiredVersionRange} but this server is ${version}.`
            };
        }
        return {
            compatible: true
        };
    }
    constructor(upgradeStatusService){
        this.upgradeStatusService = upgradeStatusService;
    }
};
ApplicationVersionValidationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _upgradestatusservice.UpgradeStatusService === "undefined" ? Object : _upgradestatusservice.UpgradeStatusService
    ])
], ApplicationVersionValidationService);

//# sourceMappingURL=application-version-validation.service.js.map