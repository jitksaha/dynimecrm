"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _usageoperationtypeenum = require("../enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../enums/usage-resource-type.enum");
const _usageunitenum = require("../enums/usage-unit.enum");
const _usageeventlistener = require("./usage-event.listener");
const USAGE_EVENT = {
    resourceType: _usageresourcetypeenum.UsageResourceType.WORKFLOW,
    operationType: _usageoperationtypeenum.UsageOperationType.WORKFLOW_EXECUTION,
    quantity: 1,
    unit: _usageunitenum.UsageUnit.INVOCATION,
    creditsUsedMicro: 1
};
const buildBatch = (overrides = {})=>({
        workspaceId: 'ws-1',
        events: [
            USAGE_EVENT
        ],
        ...overrides
    });
describe('UsageEventListener', ()=>{
    let listener;
    let dispatch;
    let isEnabled;
    beforeEach(()=>{
        jest.spyOn(_common.Logger.prototype, 'error').mockImplementation();
        dispatch = jest.fn().mockResolvedValue(undefined);
        isEnabled = jest.fn().mockReturnValue(true);
        listener = new _usageeventlistener.UsageEventListener({
            dispatch,
            isEnabled
        });
    });
    it('dispatchs a usageEvent envelope for each event in the batch', async ()=>{
        await listener.handleUsageRecordedEvent(buildBatch());
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch.mock.calls[0][0]).toEqual([
            expect.objectContaining({
                table: 'usageEvent',
                row: expect.objectContaining({
                    workspaceId: 'ws-1'
                })
            })
        ]);
    });
    it('skips when the batch has no workspaceId', async ()=>{
        await listener.handleUsageRecordedEvent(buildBatch({
            workspaceId: undefined
        }));
        expect(dispatch).not.toHaveBeenCalled();
    });
    it('skips when no sink is configured', async ()=>{
        isEnabled.mockReturnValue(false);
        await listener.handleUsageRecordedEvent(buildBatch());
        expect(dispatch).not.toHaveBeenCalled();
    });
    it('swallows dispatch errors (usage analytics is best-effort)', async ()=>{
        dispatch.mockRejectedValue(new Error('queue down'));
        await expect(listener.handleUsageRecordedEvent(buildBatch())).resolves.toBeUndefined();
    });
});

//# sourceMappingURL=usage-event.listener.spec.js.map