"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "USAGE_LIMIT_DEFINITIONS", {
    enumerable: true,
    get: function() {
        return USAGE_LIMIT_DEFINITIONS;
    }
});
const _usageoperationtypeenum = require("../../usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../usage/enums/usage-resource-type.enum");
const USAGE_LIMIT_DEFINITIONS = {
    [_usageresourcetypeenum.UsageResourceType.API]: {
        speed: {
            allowedOperationTypes: [
                _usageoperationtypeenum.UsageOperationType.API_REQUEST
            ],
            allowedSpenderTypes: [
                'apiKey',
                'application'
            ],
            fallbacks: [
                {
                    spenderType: 'apiKey',
                    counterScope: 'perWorkspace',
                    limitValueConfigVariable: 'API_RATE_LIMITING_SHORT_LIMIT',
                    windowMsConfigVariable: 'API_RATE_LIMITING_SHORT_TTL_IN_MS',
                    isOverridable: true
                },
                {
                    spenderType: 'apiKey',
                    counterScope: 'perWorkspace',
                    limitValueConfigVariable: 'API_RATE_LIMITING_LONG_LIMIT',
                    windowMsConfigVariable: 'API_RATE_LIMITING_LONG_TTL_IN_MS',
                    isOverridable: true
                },
                {
                    spenderType: 'application',
                    counterScope: 'crossWorkspace',
                    limitValueConfigVariable: 'APPLICATION_API_RATE_LIMITING_LIMIT',
                    windowMsConfigVariable: 'APPLICATION_API_RATE_LIMITING_TTL_IN_MS',
                    isOverridable: false
                }
            ]
        }
    },
    [_usageresourcetypeenum.UsageResourceType.AI]: {},
    [_usageresourcetypeenum.UsageResourceType.WORKFLOW]: {},
    [_usageresourcetypeenum.UsageResourceType.APP]: {},
    [_usageresourcetypeenum.UsageResourceType.STORAGE]: {},
    [_usageresourcetypeenum.UsageResourceType.LOGIC_FUNCTION]: {},
    [_usageresourcetypeenum.UsageResourceType.EMAIL]: {
        speed: {
            allowedOperationTypes: [
                _usageoperationtypeenum.UsageOperationType.EMAIL_SEND
            ],
            allowedSpenderTypes: [
                'workspace'
            ],
            fallbacks: [
                {
                    spenderType: 'workspace',
                    counterScope: 'crossWorkspace',
                    limitValueConfigVariable: 'EMAIL_SEND_RATE_LIMITING_LIMIT',
                    windowMsConfigVariable: 'EMAIL_SEND_RATE_LIMITING_TTL_IN_MS',
                    isOverridable: false
                }
            ]
        }
    }
};

//# sourceMappingURL=usage-limit-definitions.constant.js.map