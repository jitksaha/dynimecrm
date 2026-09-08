/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppBillingService", {
    enumerable: true,
    get: function() {
        return AppBillingService;
    }
});
const _common = require("@nestjs/common");
const _usageoperationtypeenum = require("../../usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../usage/enums/usage-resource-type.enum");
const _usageunitenum = require("../../usage/enums/usage-unit.enum");
const _usagerecorderservice = require("../../usage/services/usage-recorder.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
// Each operation type has one canonical counting unit — matches how
// `ai-billing.service.ts` emits native usage events.
const USAGE_UNIT_BY_OPERATION_TYPE = {
    [_usageoperationtypeenum.UsageOperationType.AI_CHAT_TOKEN]: _usageunitenum.UsageUnit.TOKEN,
    [_usageoperationtypeenum.UsageOperationType.AI_WORKFLOW_TOKEN]: _usageunitenum.UsageUnit.TOKEN,
    [_usageoperationtypeenum.UsageOperationType.WORKFLOW_EXECUTION]: _usageunitenum.UsageUnit.INVOCATION,
    [_usageoperationtypeenum.UsageOperationType.CODE_EXECUTION]: _usageunitenum.UsageUnit.INVOCATION,
    [_usageoperationtypeenum.UsageOperationType.WEB_SEARCH]: _usageunitenum.UsageUnit.INVOCATION,
    [_usageoperationtypeenum.UsageOperationType.CALL_RECORDING]: _usageunitenum.UsageUnit.MINUTE,
    [_usageoperationtypeenum.UsageOperationType.EMAIL_SEND]: _usageunitenum.UsageUnit.INVOCATION,
    [_usageoperationtypeenum.UsageOperationType.API_REQUEST]: _usageunitenum.UsageUnit.REQUEST
};
let AppBillingService = class AppBillingService {
    async emitChargeEvent(params) {
        const { workspaceId, applicationId, userWorkspaceId, charge } = params;
        const unit = USAGE_UNIT_BY_OPERATION_TYPE[charge.operationType];
        this.logger.log(`App charge from applicationId=${applicationId} workspaceId=${workspaceId}: ` + `${charge.creditsUsedMicro} micro-credits (${charge.quantity} ${unit}, ${charge.operationType})`);
        await this.usageRecorderService.record(workspaceId, [
            {
                resourceType: _usageresourcetypeenum.UsageResourceType.APP,
                operationType: charge.operationType,
                creditsUsedMicro: charge.creditsUsedMicro,
                quantity: charge.quantity,
                unit,
                resourceId: applicationId,
                resourceContext: charge.resourceContext ?? null,
                spenders: {
                    userWorkspaceId,
                    applicationId
                }
            }
        ]);
    }
    constructor(usageRecorderService){
        this.usageRecorderService = usageRecorderService;
        this.logger = new _common.Logger(AppBillingService.name);
    }
};
AppBillingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usagerecorderservice.UsageRecorderService === "undefined" ? Object : _usagerecorderservice.UsageRecorderService
    ])
], AppBillingService);

//# sourceMappingURL=app-billing.service.js.map