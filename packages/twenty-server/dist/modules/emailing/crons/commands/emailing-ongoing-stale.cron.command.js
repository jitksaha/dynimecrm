"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingOngoingStaleCronCommand", {
    enumerable: true,
    get: function() {
        return EmailingOngoingStaleCronCommand;
    }
});
const _emailingongoingstalecronpatternconstant = require("../../constants/emailing-ongoing-stale-cron-pattern.constant");
const _nestcommander = require("nest-commander");
const _messagequeuedecorator = require("../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../engine/core-modules/message-queue/services/message-queue.service");
const _emailingongoingstalecronjob = require("../jobs/emailing-ongoing-stale.cron.job");
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
let EmailingOngoingStaleCronCommand = class EmailingOngoingStaleCronCommand extends _nestcommander.CommandRunner {
    async run() {
        await this.messageQueueService.addCron({
            jobName: _emailingongoingstalecronjob.EmailingOngoingStaleCronJob.name,
            data: undefined,
            options: {
                repeat: {
                    pattern: _emailingongoingstalecronpatternconstant.EMAILING_ONGOING_STALE_CRON_PATTERN
                }
            }
        });
    }
    constructor(messageQueueService){
        super(), this.messageQueueService = messageQueueService;
    }
};
EmailingOngoingStaleCronCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'cron:emailing:ongoing-stale',
        description: 'Starts a cron job to reconcile message campaigns left in the sending status'
    }),
    _ts_param(0, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.cronQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], EmailingOngoingStaleCronCommand);

//# sourceMappingURL=emailing-ongoing-stale.cron.command.js.map