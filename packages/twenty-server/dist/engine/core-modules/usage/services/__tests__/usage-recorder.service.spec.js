"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _testing = require("@nestjs/testing");
const _eventlogemitterservice = require("../../../event-logs/emit/event-log-emitter.service");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
const _usageoperationtypeenum = require("../../enums/usage-operation-type.enum");
const _usageresourcetypeenum = require("../../enums/usage-resource-type.enum");
const _usageunitenum = require("../../enums/usage-unit.enum");
const _usagerecorderservice = require("../usage-recorder.service");
const _workspacecacheservice = require("../../../../workspace-cache/services/workspace-cache.service");
const _workspaceeventemitter = require("../../../../workspace-event-emitter/workspace-event-emitter");
const API_REQUEST = {
    resourceType: _usageresourcetypeenum.UsageResourceType.API,
    operationType: _usageoperationtypeenum.UsageOperationType.API_REQUEST,
    quantity: 1,
    unit: _usageunitenum.UsageUnit.REQUEST
};
describe('UsageRecorderService', ()=>{
    let recorder;
    let dispatch;
    const dispatchedRows = ()=>dispatch.mock.calls.flatMap((call)=>call[0]).map((envelope)=>envelope.row);
    beforeEach(async ()=>{
        jest.spyOn(_common.Logger.prototype, 'warn').mockImplementation();
        jest.spyOn(_common.Logger.prototype, 'error').mockImplementation();
        dispatch = jest.fn().mockResolvedValue(undefined);
        const module = await _testing.Test.createTestingModule({
            providers: [
                _usagerecorderservice.UsageRecorderService,
                {
                    provide: _eventlogemitterservice.EventLogEmitterService,
                    useValue: {
                        dispatch,
                        isEnabled: jest.fn().mockReturnValue(true)
                    }
                },
                {
                    provide: _workspaceeventemitter.WorkspaceEventEmitter,
                    useValue: {
                        emitCustomBatchEvent: jest.fn()
                    }
                },
                {
                    provide: _workspacecacheservice.WorkspaceCacheService,
                    useValue: {
                        getOrRecompute: jest.fn()
                    }
                },
                {
                    provide: _twentyconfigservice.TwentyConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue(false)
                    }
                }
            ]
        }).compile();
        recorder = module.get(_usagerecorderservice.UsageRecorderService);
    });
    afterEach(()=>{
        jest.restoreAllMocks();
    });
    it('dispatches one aggregated batch per workspace on shutdown', async ()=>{
        recorder.accumulate('ws-1', API_REQUEST);
        recorder.accumulate('ws-1', API_REQUEST);
        recorder.accumulate('ws-2', API_REQUEST);
        await recorder.onModuleDestroy();
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatchedRows()).toEqual(expect.arrayContaining([
            expect.objectContaining({
                workspaceId: 'ws-1',
                quantity: 2
            }),
            expect.objectContaining({
                workspaceId: 'ws-2',
                quantity: 1
            })
        ]));
    });
    it('re-buffers the counts of a failed dispatch instead of dropping them', async ()=>{
        dispatch.mockRejectedValueOnce(new Error('clickhouse unreachable'));
        recorder.accumulate('ws-1', API_REQUEST);
        await recorder.onModuleDestroy();
        recorder.accumulate('ws-1', API_REQUEST);
        await recorder.onModuleDestroy();
        expect(dispatchedRows()).toContainEqual(expect.objectContaining({
            workspaceId: 'ws-1',
            quantity: 2
        }));
    });
});

//# sourceMappingURL=usage-recorder.service.spec.js.map