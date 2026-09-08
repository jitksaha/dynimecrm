"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _updateeventrecordsutil = require("../update-event-records.util");
describe('update event records util', ()=>{
    it('merges returned timestamps by record id without replacing event data', ()=>{
        const eventRecords = [
            {
                id: 'one',
                name: 'Updated name',
                updatedAt: 'old-one'
            },
            {
                id: 'two',
                name: 'Another update',
                updatedAt: 'old-two'
            }
        ];
        expect((0, _updateeventrecordsutil.mergeReturnedUpdateTimestamps)(eventRecords, [
            {
                id: 'two',
                updatedAt: 'new-two'
            },
            {
                id: 'one',
                updatedAt: 'new-one'
            }
        ])).toEqual([
            {
                id: 'one',
                name: 'Updated name',
                updatedAt: 'new-one'
            },
            {
                id: 'two',
                name: 'Another update',
                updatedAt: 'new-two'
            }
        ]);
    });
    it('keeps the event timestamp when the mutation did not return one', ()=>{
        const eventRecord = {
            id: 'one',
            name: 'Updated name',
            updatedAt: 'existing'
        };
        expect((0, _updateeventrecordsutil.mergeReturnedUpdateTimestamps)([
            eventRecord
        ], [])).toEqual([
            eventRecord
        ]);
    });
});

//# sourceMappingURL=update-event-records.util.spec.js.map