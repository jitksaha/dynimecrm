// Workspace-level user vars used to make the billing reminder cron idempotent.
// The stored value is the ISO boundary date (trialEnd / currentPeriodEnd) we last
// sent a reminder for, so a yearly renewal reminder fires again next period while the
// daily cron never sends twice for the same boundary.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get BILLING_RENEWAL_REMINDER_SENT_KEY () {
        return BILLING_RENEWAL_REMINDER_SENT_KEY;
    },
    get BILLING_TRIAL_REMINDER_SENT_KEY () {
        return BILLING_TRIAL_REMINDER_SENT_KEY;
    }
});
const BILLING_TRIAL_REMINDER_SENT_KEY = 'BILLING_TRIAL_REMINDER_SENT';
const BILLING_RENEWAL_REMINDER_SENT_KEY = 'BILLING_RENEWAL_REMINDER_SENT';

//# sourceMappingURL=billing-reminder-sent-keys.constant.js.map