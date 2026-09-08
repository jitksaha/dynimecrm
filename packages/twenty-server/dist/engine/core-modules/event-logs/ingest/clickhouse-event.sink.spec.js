"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _clickhouseeventsink = require("./clickhouse-event.sink");
const makePageview = (name)=>({
        table: 'pageview',
        row: {
            type: 'page',
            name,
            properties: {},
            timestamp: 't',
            version: '1'
        }
    });
const applicationLog = {
    table: 'applicationLog',
    row: {
        timestamp: 't',
        workspaceId: 'w',
        applicationId: '',
        logicFunctionId: '',
        logicFunctionName: 'fn',
        executionId: 'e',
        level: 'INFO',
        message: 'm'
    }
};
describe('ClickHouseEventSink', ()=>{
    let sink;
    let insert;
    let getMainClient;
    beforeEach(()=>{
        insert = jest.fn().mockResolvedValue({
            success: true
        });
        getMainClient = jest.fn().mockReturnValue({});
        sink = new _clickhouseeventsink.ClickHouseEventSink({
            insert,
            getMainClient
        });
    });
    it('groups envelopes by table and inserts each group once', async ()=>{
        const first = makePageview('a');
        const second = makePageview('b');
        await sink.write([
            first,
            second,
            applicationLog
        ]);
        expect(insert).toHaveBeenCalledTimes(2);
        expect(insert).toHaveBeenCalledWith('pageview', [
            first.row,
            second.row
        ], {
            asyncInsertBusyTimeoutMaxMs: 100
        });
        expect(insert).toHaveBeenCalledWith('applicationLog', [
            applicationLog.row
        ], undefined);
    });
    it('no-ops when ClickHouse is not configured', async ()=>{
        getMainClient.mockReturnValue(undefined);
        await sink.write([
            makePageview('a')
        ]);
        expect(insert).not.toHaveBeenCalled();
    });
    it('no-ops on an empty batch', async ()=>{
        await sink.write([]);
        expect(insert).not.toHaveBeenCalled();
    });
    it('throws when a ClickHouse insert fails so the consumer retries', async ()=>{
        insert.mockResolvedValue({
            success: false,
            error: new Error('boom')
        });
        await expect(sink.write([
            makePageview('a')
        ])).rejects.toThrow();
    });
    it('surfaces the underlying ClickHouse error in the message and cause', async ()=>{
        const error = new Error('socket hang up');
        insert.mockResolvedValue({
            success: false,
            error
        });
        await expect(sink.write([
            makePageview('a')
        ])).rejects.toMatchObject({
            message: 'Failed to insert 1 pageview row(s) into ClickHouse: socket hang up',
            cause: error
        });
    });
});

//# sourceMappingURL=clickhouse-event.sink.spec.js.map