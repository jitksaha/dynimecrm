"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _usageoperationtypeenum = require("../../enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../enums/usage-resource-type.enum");
const _usageunitenum = require("../../enums/usage-unit.enum");
const _usagerollupbuffer = require("../usage-rollup-buffer");
const apiRequest = (overrides = {})=>({
        resourceType: _usageresourcetypeenum.UsageResourceType.API,
        operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST,
        quantity: 1,
        unit: _usageunitenum.UsageUnit.REQUEST,
        creditsUsedMicro: 0,
        ...overrides
    });
describe('UsageRollupBuffer', ()=>{
    it('sums the quantities and credits of events sharing the same scope', ()=>{
        const buffer = new _usagerollupbuffer.UsageRollupBuffer(10);
        buffer.increment('ws-1', apiRequest({
            creditsUsedMicro: 5
        }));
        buffer.increment('ws-1', apiRequest({
            quantity: 2,
            creditsUsedMicro: 7
        }));
        expect(buffer.drain().get('ws-1')).toEqual([
            expect.objectContaining({
                quantity: 3,
                creditsUsedMicro: 12
            })
        ]);
    });
    it('keeps a row per spender', ()=>{
        const buffer = new _usagerollupbuffer.UsageRollupBuffer(10);
        buffer.increment('ws-1', apiRequest({
            spenders: {
                apiKeyId: 'key-1'
            }
        }));
        buffer.increment('ws-1', apiRequest({
            spenders: {
                apiKeyId: 'key-2'
            }
        }));
        expect(buffer.drain().get('ws-1')).toHaveLength(2);
    });
    it('keeps a row per period so a window straddling a boundary does not merge two periods', ()=>{
        const buffer = new _usagerollupbuffer.UsageRollupBuffer(10);
        buffer.increment('ws-1', apiRequest({
            periodStart: new Date('2026-01-01T00:00:00.000Z')
        }));
        buffer.increment('ws-1', apiRequest({
            periodStart: new Date('2026-02-01T00:00:00.000Z')
        }));
        expect(buffer.drain().get('ws-1')).toHaveLength(2);
    });
    it('groups drained events by workspace and empties the buffer', ()=>{
        const buffer = new _usagerollupbuffer.UsageRollupBuffer(10);
        buffer.increment('ws-1', apiRequest());
        buffer.increment('ws-2', apiRequest());
        expect([
            ...buffer.drain().keys()
        ]).toEqual([
            'ws-1',
            'ws-2'
        ]);
        expect(buffer.drain().size).toBe(0);
    });
    it('reports being full once the max entry count is reached', ()=>{
        const buffer = new _usagerollupbuffer.UsageRollupBuffer(1);
        expect(buffer.isFull).toBe(false);
        buffer.increment('ws-1', apiRequest());
        expect(buffer.isFull).toBe(true);
    });
});

//# sourceMappingURL=usage-rollup-buffer.spec.js.map