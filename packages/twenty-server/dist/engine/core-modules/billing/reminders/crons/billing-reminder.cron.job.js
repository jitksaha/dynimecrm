"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingReminderCronJob", {
    enumerable: true,
    get: function() {
        return BillingReminderCronJob;
    }
});
const _sentrycronmonitordecorator = require("../../../cron/sentry-cron-monitor.decorator");
const _billingremindercronpatternconstant = require("../constants/billing-reminder.cron-pattern.constant");
const _billingreminderservice = require("../services/billing-reminder.service");
const _processdecorator = require("../../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../message-queue/message-queue.constants");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BillingReminderCronJob = class BillingReminderCronJob {
    async handle() {
        await this.billingReminderService.processReminders();
    }
    constructor(billingReminderService){
        this.billingReminderService = billingReminderService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(BillingReminderCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(BillingReminderCronJob.name, _billingremindercronpatternconstant.BILLING_REMINDER_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], BillingReminderCronJob.prototype, "handle", null);
BillingReminderCronJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingreminderservice.BillingReminderService === "undefined" ? Object : _billingreminderservice.BillingReminderService
    ])
], BillingReminderCronJob);

//# sourceMappingURL=billing-reminder.cron.job.js.map