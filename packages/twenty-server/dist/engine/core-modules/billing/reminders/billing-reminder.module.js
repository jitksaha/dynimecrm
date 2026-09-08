"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingReminderModule", {
    enumerable: true,
    get: function() {
        return BillingReminderModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _billingsubscriptionentity = require("../entities/billing-subscription.entity");
const _billingremindercroncommand = require("./crons/commands/billing-reminder.cron.command");
const _billingreminderservice = require("./services/billing-reminder.service");
const _workspacedomainsmodule = require("../../domain/workspace-domains/workspace-domains.module");
const _emailmodule = require("../../email/email.module");
const _uservarsmodule = require("../../user/user-vars/user-vars.module");
const _usermodule = require("../../user/user.module");
const _workspaceentity = require("../../workspace/workspace.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BillingReminderModule = class BillingReminderModule {
};
BillingReminderModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _billingsubscriptionentity.BillingSubscriptionEntity,
                _workspaceentity.WorkspaceEntity
            ]),
            _emailmodule.EmailModule,
            _usermodule.UserModule,
            _uservarsmodule.UserVarsModule,
            _workspacedomainsmodule.WorkspaceDomainsModule
        ],
        providers: [
            _billingreminderservice.BillingReminderService,
            _billingremindercroncommand.BillingReminderCronCommand
        ],
        exports: [
            _billingreminderservice.BillingReminderService,
            _billingremindercroncommand.BillingReminderCronCommand
        ]
    })
], BillingReminderModule);

//# sourceMappingURL=billing-reminder.module.js.map