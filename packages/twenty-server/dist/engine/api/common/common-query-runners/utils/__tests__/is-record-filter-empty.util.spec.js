"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isrecordfilteremptyutil = require("../is-record-filter-empty.util");
const asFilter = (filter)=>filter;
describe('isRecordFilterEmpty', ()=>{
    it('should treat a filter with no keys as empty', ()=>{
        expect((0, _isrecordfilteremptyutil.isRecordFilterEmpty)({})).toBe(true);
    });
    it('should treat an empty "and" group as empty', ()=>{
        expect((0, _isrecordfilteremptyutil.isRecordFilterEmpty)(asFilter({
            and: []
        }))).toBe(true);
    });
    it('should treat an empty "or" group as empty', ()=>{
        expect((0, _isrecordfilteremptyutil.isRecordFilterEmpty)(asFilter({
            or: []
        }))).toBe(true);
    });
    it('should treat a "not" wrapping an empty filter as empty', ()=>{
        expect((0, _isrecordfilteremptyutil.isRecordFilterEmpty)(asFilter({
            not: {}
        }))).toBe(true);
    });
    it('should treat a group whose every element is empty as empty', ()=>{
        expect((0, _isrecordfilteremptyutil.isRecordFilterEmpty)(asFilter({
            and: [
                {},
                {
                    or: []
                }
            ]
        }))).toBe(true);
    });
    it('should not treat an id condition as empty', ()=>{
        expect((0, _isrecordfilteremptyutil.isRecordFilterEmpty)(asFilter({
            id: {
                in: [
                    '20202020-0000-0000-0000-000000000000'
                ]
            }
        }))).toBe(false);
    });
    it('should not treat a field condition as empty', ()=>{
        expect((0, _isrecordfilteremptyutil.isRecordFilterEmpty)(asFilter({
            name: {
                eq: 'Twenty'
            }
        }))).toBe(false);
    });
    it('should not treat a group holding a real condition as empty', ()=>{
        expect((0, _isrecordfilteremptyutil.isRecordFilterEmpty)(asFilter({
            and: [
                {},
                {
                    name: {
                        eq: 'Twenty'
                    }
                }
            ]
        }))).toBe(false);
    });
    it('should not treat a "not" wrapping a real condition as empty', ()=>{
        expect((0, _isrecordfilteremptyutil.isRecordFilterEmpty)(asFilter({
            not: {
                name: {
                    eq: 'Twenty'
                }
            }
        }))).toBe(false);
    });
});

//# sourceMappingURL=is-record-filter-empty.util.spec.js.map