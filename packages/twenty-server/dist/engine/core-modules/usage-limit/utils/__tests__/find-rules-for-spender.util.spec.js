"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _usageoperationtypeenum = require("../../../usage/enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../../usage/enums/usage-resource-type.enum");
const _findrulesforspenderutil = require("../find-rules-for-spender.util");
const buildRule = (overrides)=>({
        id: 'rule-id',
        resourceType: _usageresourcetypeenum.UsageResourceType.API,
        operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST,
        spenderType: 'apiKey',
        spenderId: '',
        limitKind: 'speed',
        windowSeconds: 60,
        limitValueType: 'absolute',
        limitValue: 100,
        burstValue: null,
        ...overrides
    });
describe('findRulesForSpender', ()=>{
    const spender = {
        spenderType: 'apiKey',
        spenderId: 'key-1'
    };
    it('charges a named spender against its own rule and the shared one', ()=>{
        const shared = buildRule({
            id: 'shared',
            spenderId: ''
        });
        const own = buildRule({
            id: 'own',
            spenderId: 'key-1',
            limitValue: 50
        });
        expect((0, _findrulesforspenderutil.findRulesForSpender)({
            rules: [
                shared,
                own
            ],
            spender,
            operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST
        })).toEqual([
            shared,
            own
        ]);
    });
    it('charges a spender with no rule of its own against the shared rule', ()=>{
        const shared = buildRule({
            id: 'shared',
            spenderId: ''
        });
        expect((0, _findrulesforspenderutil.findRulesForSpender)({
            rules: [
                shared
            ],
            spender,
            operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST
        })).toEqual([
            shared
        ]);
    });
    it('ignores a rule belonging to another spender', ()=>{
        const otherKey = buildRule({
            id: 'other',
            spenderId: 'key-2'
        });
        expect((0, _findrulesforspenderutil.findRulesForSpender)({
            rules: [
                otherKey
            ],
            spender,
            operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST
        })).toEqual([]);
    });
    it('ignores a rule scoped to another spender type', ()=>{
        const application = buildRule({
            id: 'application',
            spenderType: 'application',
            spenderId: ''
        });
        expect((0, _findrulesforspenderutil.findRulesForSpender)({
            rules: [
                application
            ],
            spender,
            operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST
        })).toEqual([]);
    });
    it('ignores a rule scoped to a different operation', ()=>{
        const otherOperation = buildRule({
            spenderId: 'key-1',
            operationType: _usageoperationtypeenum.UsageOperationType.AI_CHAT_TOKEN
        });
        expect((0, _findrulesforspenderutil.findRulesForSpender)({
            rules: [
                otherOperation
            ],
            spender,
            operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST
        })).toEqual([]);
    });
    it('returns a burst and a sustained rule together', ()=>{
        const burst = buildRule({
            id: 'burst',
            windowSeconds: 1,
            limitValue: 20
        });
        const sustained = buildRule({
            id: 'sustained',
            windowSeconds: 60
        });
        expect((0, _findrulesforspenderutil.findRulesForSpender)({
            rules: [
                burst,
                sustained
            ],
            spender,
            operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST
        })).toEqual([
            burst,
            sustained
        ]);
    });
    it('keeps every window of the shared rules when the spender has its own rule', ()=>{
        const sharedBurst = buildRule({
            id: 'shared-burst',
            windowSeconds: 1,
            limitValue: 20
        });
        const sharedSustained = buildRule({
            id: 'shared-sustained'
        });
        const own = buildRule({
            id: 'own',
            spenderId: 'key-1',
            limitValue: 5000
        });
        expect((0, _findrulesforspenderutil.findRulesForSpender)({
            rules: [
                sharedBurst,
                sharedSustained,
                own
            ],
            spender,
            operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST
        })).toEqual([
            sharedBurst,
            sharedSustained,
            own
        ]);
    });
});

//# sourceMappingURL=find-rules-for-spender.util.spec.js.map