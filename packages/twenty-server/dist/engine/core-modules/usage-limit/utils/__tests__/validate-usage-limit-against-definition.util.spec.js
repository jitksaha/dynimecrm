"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _usageoperationtypeenum = require("../../../usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../../usage/enums/usage-resource-type.enum");
const _usagelimitexception = require("../../exceptions/usage-limit.exception");
const _validateusagelimitagainstdefinitionutil = require("../validate-usage-limit-against-definition.util");
const validSpeedRule = {
    resourceType: _usageresourcetypeenum.UsageResourceType.API,
    operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST,
    spenderType: 'apiKey',
    spenderId: '20202020-1c25-4d02-bf25-6aeccf7ea419',
    limitKind: 'speed',
    windowSeconds: 60,
    limitValue: 100
};
describe('validateUsageLimitAgainstDefinition', ()=>{
    it('accepts a rule the definition allows', ()=>{
        expect(()=>(0, _validateusagelimitagainstdefinitionutil.validateUsageLimitAgainstDefinition)(validSpeedRule)).not.toThrow();
    });
    it('rejects a resource that has no definition', ()=>{
        expect(()=>(0, _validateusagelimitagainstdefinitionutil.validateUsageLimitAgainstDefinition)({
                ...validSpeedRule,
                resourceType: _usageresourcetypeenum.UsageResourceType.STORAGE
            })).toThrow(expect.objectContaining({
            code: _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID
        }));
    });
    it('rejects an operation the resource does not meter', ()=>{
        expect(()=>(0, _validateusagelimitagainstdefinitionutil.validateUsageLimitAgainstDefinition)({
                ...validSpeedRule,
                operationType: _usageoperationtypeenum.UsageOperationType.EMAIL_SEND
            })).toThrow(expect.objectContaining({
            code: _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID
        }));
    });
    it('refuses to rate-limit a human, because the definition does not allow that scope', ()=>{
        expect(()=>(0, _validateusagelimitagainstdefinitionutil.validateUsageLimitAgainstDefinition)({
                ...validSpeedRule,
                spenderType: 'userWorkspace'
            })).toThrow(expect.objectContaining({
            code: _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID
        }));
    });
    it('rejects a speed rule with no window', ()=>{
        expect(()=>(0, _validateusagelimitagainstdefinitionutil.validateUsageLimitAgainstDefinition)({
                ...validSpeedRule,
                windowSeconds: 0
            })).toThrow(expect.objectContaining({
            code: _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID
        }));
    });
    it('rejects a workspace rule, because the definition does not allow that scope', ()=>{
        expect(()=>(0, _validateusagelimitagainstdefinitionutil.validateUsageLimitAgainstDefinition)({
                ...validSpeedRule,
                spenderType: 'workspace',
                spenderId: null
            })).toThrow(expect.objectContaining({
            code: _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID
        }));
    });
    it('rejects a spender id that is not a uuid', ()=>{
        expect(()=>(0, _validateusagelimitagainstdefinitionutil.validateUsageLimitAgainstDefinition)({
                ...validSpeedRule,
                spenderId: 'key-1'
            })).toThrow(expect.objectContaining({
            code: _usagelimitexception.UsageLimitExceptionCode.LIMIT_RULE_INVALID
        }));
    });
    it('accepts a rule targeting every spender of a type', ()=>{
        expect(()=>(0, _validateusagelimitagainstdefinitionutil.validateUsageLimitAgainstDefinition)({
                ...validSpeedRule,
                spenderId: null
            })).not.toThrow();
    });
});

//# sourceMappingURL=validate-usage-limit-against-definition.util.spec.js.map