"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationKillSwitchCommand", {
    enumerable: true,
    get: function() {
        return ApplicationKillSwitchCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _chalk = /*#__PURE__*/ _interop_require_default(require("chalk"));
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _logger = require("../../../../../database/commands/logger");
const _askcommandconfirmationutil = require("../../../../../database/commands/utils/ask-command-confirmation.util");
const _applicationregistrationentity = require("../../application-registration/application-registration.entity");
const _applicationstopservice = require("../application-stop.service");
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
const KILL_SWITCH_ACTIONS = [
    'stop',
    'remove'
];
let ApplicationKillSwitchCommand = class ApplicationKillSwitchCommand extends _nestcommander.CommandRunner {
    parseApplicationUniversalIdentifier(value) {
        return value;
    }
    parseYes() {
        return true;
    }
    async run(passedParams, options) {
        const action = passedParams[0] ?? 'stop';
        if (!KILL_SWITCH_ACTIONS.includes(action)) {
            throw new Error(`Invalid action "${passedParams[0]}". Expected one of: ${KILL_SWITCH_ACTIONS.join(', ')}`);
        }
        const registration = await this.applicationRegistrationRepository.findOne({
            where: {
                universalIdentifier: options.applicationUniversalIdentifier
            }
        });
        if (!(0, _utils.isDefined)(registration)) {
            throw new Error(`Application registration with universal identifier ${options.applicationUniversalIdentifier} not found`);
        }
        if (!(options.yes ?? false)) {
            const isConfirmed = await this.askForConfirmation(action, options.applicationUniversalIdentifier, registration.id);
            if (!isConfirmed) {
                this.logger.log('Aborted, kill switch left unchanged');
                return;
            }
        }
        if (action === 'stop') {
            await this.applicationStopService.stop(options.applicationUniversalIdentifier);
        } else {
            await this.applicationStopService.remove(options.applicationUniversalIdentifier);
        }
        this.logger.log(`Kill switch ${action === 'stop' ? 'enabled' : 'removed'} for "${registration.name}" (${options.applicationUniversalIdentifier}). Workers pick it up within a minute.`);
        this.logger.log(_chalk.default.blue('Command completed!'));
    }
    async askForConfirmation(action, applicationUniversalIdentifier, applicationRegistrationId) {
        const installationCount = await this.applicationRepository.count({
            where: {
                applicationRegistrationId
            }
        });
        const actionLabel = action === 'stop' ? 'stopping' : 'removing the kill switch of';
        return (0, _askcommandconfirmationutil.askCommandConfirmation)(`Confirm ${actionLabel} application ${applicationUniversalIdentifier} on ${installationCount} workspace(s)`);
    }
    constructor(applicationRegistrationRepository, applicationRepository, applicationStopService){
        super(), this.applicationRegistrationRepository = applicationRegistrationRepository, this.applicationRepository = applicationRepository, this.applicationStopService = applicationStopService;
        this.logger = new _logger.CommandLogger({
            verbose: false,
            constructorName: this.constructor.name
        });
    }
};
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '-u, --application-universal-identifier <application_universal_identifier>',
        description: 'Application universal identifier',
        required: true
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", String)
], ApplicationKillSwitchCommand.prototype, "parseApplicationUniversalIdentifier", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '-y, --yes',
        description: 'Skip the confirmation prompt (for non-interactive usage)',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Boolean)
], ApplicationKillSwitchCommand.prototype, "parseYes", null);
ApplicationKillSwitchCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'application:kill-switch',
        arguments: '[action]',
        description: 'Toggle an application kill switch on every workspace: "stop" (default) halts its logic function executions until "remove" clears the switch.'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _applicationstopservice.ApplicationStopService === "undefined" ? Object : _applicationstopservice.ApplicationStopService
    ])
], ApplicationKillSwitchCommand);

//# sourceMappingURL=application-kill-switch.command.js.map