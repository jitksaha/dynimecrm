"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _doesobjectrecordeventchangefieldsutil = require("../does-object-record-event-change-fields.util");
const FIELD_NAMES = [
    'messageId',
    'personId',
    'workspaceMemberId'
];
const buildEvent = ({ updatedFields, diff })=>({
        recordId: 'junction-record-id',
        properties: {
            updatedFields,
            diff
        }
    });
describe('doesObjectRecordEventChangeFields', ()=>{
    it('detects a watched field in the ORM updated fields', ()=>{
        expect((0, _doesobjectrecordeventchangefieldsutil.doesObjectRecordEventChangeFields)({
            event: buildEvent({
                updatedFields: [
                    'message',
                    'messageId'
                ]
            }),
            fieldNames: FIELD_NAMES
        })).toBe(true);
    });
    it('supports events carrying only a diff', ()=>{
        expect((0, _doesobjectrecordeventchangefieldsutil.doesObjectRecordEventChangeFields)({
            event: buildEvent({
                diff: {
                    personId: {
                        before: null,
                        after: 'id'
                    }
                }
            }),
            fieldNames: FIELD_NAMES
        })).toBe(true);
    });
    it('ignores unrelated field changes', ()=>{
        expect((0, _doesobjectrecordeventchangefieldsutil.doesObjectRecordEventChangeFields)({
            event: buildEvent({
                updatedFields: [
                    'handle'
                ]
            }),
            fieldNames: FIELD_NAMES
        })).toBe(false);
    });
    it('returns false when change metadata is absent', ()=>{
        expect((0, _doesobjectrecordeventchangefieldsutil.doesObjectRecordEventChangeFields)({
            event: buildEvent({}),
            fieldNames: FIELD_NAMES
        })).toBe(false);
    });
});

//# sourceMappingURL=does-object-record-event-change-fields.util.spec.js.map