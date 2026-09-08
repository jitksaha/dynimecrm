"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _usageoperationtypeenum = require("../enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../enums/usage-resource-type.enum");
const _usageunitenum = require("../enums/usage-unit.enum");
const _buildusageeventenvelopes = require("./build-usage-event-envelopes");
const usageEvent = (overrides = {})=>({
        resourceType: _usageresourcetypeenum.UsageResourceType.AI,
        operationType: _usageoperationtypeenum.UsageOperationType.AI_CHAT_TOKEN,
        quantity: 1500,
        unit: _usageunitenum.UsageUnit.TOKEN,
        creditsUsedMicro: 7500,
        ...overrides
    });
describe('buildUsageEventEnvelopes', ()=>{
    it('maps each usage event to a usageEvent envelope carrying the workspace + columns', ()=>{
        const envelopes = (0, _buildusageeventenvelopes.buildUsageEventEnvelopes)('ws-1', [
            usageEvent({
                spenders: {
                    userWorkspaceId: 'uw-1',
                    agentId: 'agent-1'
                },
                resourceId: 'agent-1',
                resourceContext: 'gpt-4o'
            })
        ]);
        expect(envelopes).toHaveLength(1);
        expect(envelopes[0].table).toBe('usageEvent');
        expect(envelopes[0].row).toMatchObject({
            workspaceId: 'ws-1',
            userWorkspaceId: 'uw-1',
            agentId: 'agent-1',
            resourceType: _usageresourcetypeenum.UsageResourceType.AI,
            operationType: _usageoperationtypeenum.UsageOperationType.AI_CHAT_TOKEN,
            quantity: 1500,
            creditsUsedMicro: 7500,
            resourceId: 'agent-1',
            resourceContext: 'gpt-4o'
        });
    });
    it('defaults the optional string columns to empty and omits periodStart when absent', ()=>{
        const [envelope] = (0, _buildusageeventenvelopes.buildUsageEventEnvelopes)('ws-1', [
            usageEvent()
        ]);
        expect(envelope.row).toMatchObject({
            userWorkspaceId: '',
            apiKeyId: '',
            applicationId: '',
            agentId: '',
            workflowId: '',
            logicFunctionId: '',
            resourceId: '',
            resourceContext: ''
        });
        expect(envelope.row.periodStart).toBeUndefined();
    });
    it('formats periodStart for ClickHouse when present', ()=>{
        const [envelope] = (0, _buildusageeventenvelopes.buildUsageEventEnvelopes)('ws-1', [
            usageEvent({
                periodStart: new Date('2026-01-01T00:00:00.000Z')
            })
        ]);
        expect(envelope.row.periodStart).toBe('2026-01-01 00:00:00.000');
    });
});

//# sourceMappingURL=build-usage-event-envelopes.spec.js.map