"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isbulkmailutil = require("../is-bulk-mail.util");
describe('isBulkMail', ()=>{
    it('should detect a List-Unsubscribe header regardless of casing', ()=>{
        expect((0, _isbulkmailutil.isBulkMail)([
            {
                name: 'List-Unsubscribe',
                value: '<https://example.com/unsub>'
            }
        ])).toBe(true);
        expect((0, _isbulkmailutil.isBulkMail)([
            {
                name: 'list-unsubscribe',
                value: '<mailto:unsub@example.com>'
            }
        ])).toBe(true);
    });
    it('should detect a List-Id header', ()=>{
        expect((0, _isbulkmailutil.isBulkMail)([
            {
                name: 'List-Id',
                value: '<newsletter.example.com>'
            }
        ])).toBe(true);
    });
    it('should detect bulk precedence values only', ()=>{
        expect((0, _isbulkmailutil.isBulkMail)([
            {
                name: 'Precedence',
                value: 'bulk'
            }
        ])).toBe(true);
        expect((0, _isbulkmailutil.isBulkMail)([
            {
                name: 'Precedence',
                value: ' List '
            }
        ])).toBe(true);
        expect((0, _isbulkmailutil.isBulkMail)([
            {
                name: 'Precedence',
                value: 'urgent'
            }
        ])).toBe(false);
    });
    it('should treat Auto-Submitted as bulk unless it is "no"', ()=>{
        expect((0, _isbulkmailutil.isBulkMail)([
            {
                name: 'Auto-Submitted',
                value: 'auto-generated'
            }
        ])).toBe(true);
        expect((0, _isbulkmailutil.isBulkMail)([
            {
                name: 'Auto-Submitted',
                value: 'no'
            }
        ])).toBe(false);
    });
    it('should not flag a regular message', ()=>{
        expect((0, _isbulkmailutil.isBulkMail)([
            {
                name: 'From',
                value: 'tim@apple.com'
            },
            {
                name: 'Subject',
                value: 'Lunch'
            },
            {
                name: 'List-Unsubscribe',
                value: ''
            }
        ])).toBe(false);
    });
    it('should not flag a message without headers', ()=>{
        expect((0, _isbulkmailutil.isBulkMail)([])).toBe(false);
    });
});

//# sourceMappingURL=is-bulk-mail.util.spec.js.map