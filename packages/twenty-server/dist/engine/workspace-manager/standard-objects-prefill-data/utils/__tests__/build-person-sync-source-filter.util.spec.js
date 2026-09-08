"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildpersonsyncsourcefilterutil = require("../build-person-sync-source-filter.util");
const _evaluatestepfiltersutil = require("../../../../../modules/workflow/workflow-executor/workflow-actions/filter/utils/evaluate-step-filters.util");
describe('buildPersonSyncSourceFilter', ()=>{
    const filter = (0, _buildpersonsyncsourcefilterutil.buildPersonSyncSourceFilter)({
        createdByFieldMetadataId: 'created-by-field-id'
    });
    const evaluateForSource = (source)=>(0, _evaluatestepfiltersutil.evaluateStepFilters)({
            stepFilters: filter.stepFilters,
            stepFilterGroups: filter.stepFilterGroups,
            context: {
                trigger: {
                    properties: {
                        after: {
                            createdBy: source === undefined ? {} : {
                                source
                            }
                        }
                    }
                }
            }
        });
    it('suppresses people auto-created by the email sync', ()=>{
        expect(evaluateForSource('EMAIL')).toBe(false);
    });
    it('suppresses people auto-created by the calendar sync', ()=>{
        expect(evaluateForSource('CALENDAR')).toBe(false);
    });
    it.each([
        'MANUAL',
        'API',
        'IMPORT',
        'WORKFLOW',
        'SYSTEM',
        'WEBHOOK'
    ])('runs the workflow for people created via %s', (source)=>{
        expect(evaluateForSource(source)).toBe(true);
    });
    it('runs the workflow when the createdBy source is missing (fails open)', ()=>{
        expect(evaluateForSource(undefined)).toBe(true);
    });
    it('builds two ANDed source filters that reference the given field', ()=>{
        expect(filter.stepFilterGroups).toHaveLength(1);
        expect(filter.stepFilterGroups[0].logicalOperator).toBe('AND');
        expect(filter.stepFilters).toHaveLength(2);
        expect(filter.stepFilters.every((stepFilter)=>stepFilter.fieldMetadataId === 'created-by-field-id' && stepFilter.operand === 'IS_NOT' && stepFilter.compositeFieldSubFieldName === 'source' && stepFilter.stepFilterGroupId === filter.stepFilterGroups[0].id)).toBe(true);
    });
});

//# sourceMappingURL=build-person-sync-source-filter.util.spec.js.map