"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _evaluatestepfiltersutil = require("../evaluate-step-filters.util");
describe('evaluateStepFilters', ()=>{
    const context = {
        trigger: {
            properties: {
                after: {
                    createdBy: {
                        source: 'EMAIL'
                    },
                    name: 'Acme',
                    companyId: null,
                    jobTitle: ''
                }
            }
        }
    };
    const group = {
        id: 'group-1',
        logicalOperator: _types.StepLogicalOperator.AND
    };
    const sourceFilter = (operand)=>({
            id: 'filter-1',
            type: 'ACTOR',
            operand,
            value: JSON.stringify([
                'EMAIL'
            ]),
            stepOutputKey: '{{trigger.properties.after.createdBy.source}}',
            stepFilterGroupId: group.id,
            compositeFieldSubFieldName: 'source'
        });
    it('returns true when there are no filters', ()=>{
        expect((0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilters: [],
            stepFilterGroups: [],
            context
        })).toBe(true);
    });
    it('resolves operands from the context and matches the record', ()=>{
        expect((0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilterGroups: [
                group
            ],
            stepFilters: [
                sourceFilter(_types.ViewFilterOperand.IS)
            ],
            context
        })).toBe(true);
    });
    it('returns false when the record source is excluded (IS_NOT)', ()=>{
        expect((0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilterGroups: [
                group
            ],
            stepFilters: [
                sourceFilter(_types.ViewFilterOperand.IS_NOT)
            ],
            context
        })).toBe(false);
    });
    it('returns true when a different source is excluded (IS_NOT)', ()=>{
        const calendarFilter = {
            ...sourceFilter(_types.ViewFilterOperand.IS_NOT),
            value: JSON.stringify([
                'CALENDAR'
            ])
        };
        expect((0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilterGroups: [
                group
            ],
            stepFilters: [
                calendarFilter
            ],
            context
        })).toBe(true);
    });
    it('evaluates IS_NOT_EMPTY against a present field when no value is set', ()=>{
        const filter = {
            id: 'filter-present',
            type: 'TEXT',
            operand: _types.ViewFilterOperand.IS_NOT_EMPTY,
            value: '',
            stepOutputKey: '{{trigger.properties.after.name}}',
            stepFilterGroupId: group.id
        };
        expect((0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilterGroups: [
                group
            ],
            stepFilters: [
                filter
            ],
            context
        })).toBe(true);
    });
    it('resolves a missing field path to empty (IS_EMPTY is true)', ()=>{
        const filter = {
            id: 'filter-missing',
            type: 'TEXT',
            operand: _types.ViewFilterOperand.IS_EMPTY,
            value: '',
            stepOutputKey: '{{trigger.properties.after.missingField}}',
            stepFilterGroupId: group.id
        };
        expect((0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilterGroups: [
                group
            ],
            stepFilters: [
                filter
            ],
            context
        })).toBe(true);
    });
    it('applies implicit AND across flat filters without groups', ()=>{
        const nameContains = {
            id: 'name-contains',
            type: 'TEXT',
            operand: _types.ViewFilterOperand.CONTAINS,
            value: 'Acme',
            stepOutputKey: '{{trigger.properties.after.name}}',
            stepFilterGroupId: 'unused'
        };
        const sourceIsCalendar = {
            ...sourceFilter(_types.ViewFilterOperand.IS),
            value: JSON.stringify([
                'CALENDAR'
            ]),
            stepFilterGroupId: 'unused'
        };
        expect((0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilterGroups: [],
            stepFilters: [
                nameContains,
                sourceIsCalendar
            ],
            context
        })).toBe(false);
    });
    const companyFilter = (operand, stepOutputKey)=>({
            id: 'filter-company',
            type: 'TEXT',
            operand,
            value: '{{trigger.properties.after.companyId}}',
            stepOutputKey,
            stepFilterGroupId: group.id
        });
    it('matches an empty field when the filter variable resolves to null', ()=>{
        expect((0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilterGroups: [
                group
            ],
            stepFilters: [
                companyFilter(_types.ViewFilterOperand.IS, '{{trigger.properties.after.jobTitle}}')
            ],
            context
        })).toBe(true);
    });
    it('does not match a field that has a value when the filter variable resolves to null', ()=>{
        expect((0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilterGroups: [
                group
            ],
            stepFilters: [
                companyFilter(_types.ViewFilterOperand.IS, '{{trigger.properties.after.name}}')
            ],
            context
        })).toBe(false);
    });
    it('inverts that for IS_NOT when the filter variable resolves to null', ()=>{
        expect((0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilterGroups: [
                group
            ],
            stepFilters: [
                companyFilter(_types.ViewFilterOperand.IS_NOT, '{{trigger.properties.after.name}}')
            ],
            context
        })).toBe(true);
    });
    it('leaves a filter the user never filled in alone, so an empty field is not treated as a match', ()=>{
        expect((0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilterGroups: [
                group
            ],
            stepFilters: [
                {
                    ...companyFilter(_types.ViewFilterOperand.IS, '{{trigger.properties.after.companyId}}'),
                    value: ''
                }
            ],
            context
        })).toBe(false);
    });
});

//# sourceMappingURL=evaluate-step-filters.util.spec.js.map