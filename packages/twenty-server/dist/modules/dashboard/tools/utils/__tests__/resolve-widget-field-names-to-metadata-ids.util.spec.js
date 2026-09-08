"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _buildfieldbyobjectidandnamekeyutil = require("../../../../../engine/metadata-modules/flat-field-metadata/utils/build-field-by-object-id-and-name-key.util");
const _widgetconfigurationtypetype = require("../../../../../engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
const _resolvewidgetfieldnamestometadataidsutil = require("../resolve-widget-field-names-to-metadata-ids.util");
const OBJECT_ID = '11111111-1111-4111-8111-111111111111';
const AMOUNT_FIELD_ID = '22222222-2222-4222-8222-222222222222';
const STAGE_FIELD_ID = '33333333-3333-4333-8333-333333333333';
const CREATED_AT_FIELD_ID = '44444444-4444-4444-8444-444444444444';
const buildMaps = ()=>({
        objectIdByName: {
            opportunity: OBJECT_ID,
            opportunities: OBJECT_ID
        },
        fieldIdByObjectIdAndName: new Map([
            [
                (0, _buildfieldbyobjectidandnamekeyutil.buildFieldByObjectIdAndNameKey)(OBJECT_ID, 'amount'),
                AMOUNT_FIELD_ID
            ],
            [
                (0, _buildfieldbyobjectidandnamekeyutil.buildFieldByObjectIdAndNameKey)(OBJECT_ID, 'stage'),
                STAGE_FIELD_ID
            ],
            [
                (0, _buildfieldbyobjectidandnamekeyutil.buildFieldByObjectIdAndNameKey)(OBJECT_ID, 'createdAt'),
                CREATED_AT_FIELD_ID
            ]
        ]),
        fieldById: new Map([
            [
                AMOUNT_FIELD_ID,
                {
                    type: _types.FieldMetadataType.CURRENCY
                }
            ],
            [
                STAGE_FIELD_ID,
                {
                    type: _types.FieldMetadataType.SELECT
                }
            ],
            [
                CREATED_AT_FIELD_ID,
                {
                    type: _types.FieldMetadataType.DATE_TIME
                }
            ]
        ])
    });
const getResolvedFilter = (configuration)=>configuration.filter;
const buildAggregateWidget = (filter)=>({
        title: 'KPI',
        type: _types.WidgetType.GRAPH,
        position: {
            layoutMode: _types.PageLayoutTabLayoutMode.GRID,
            row: 0,
            column: 0,
            rowSpan: 2,
            columnSpan: 4
        },
        objectName: 'opportunity',
        configuration: {
            configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.AGGREGATE_CHART,
            aggregateFieldName: 'amount',
            aggregateOperation: _types.AggregateOperations.SUM,
            displayDataLabel: true,
            filter
        }
    });
describe('resolveWidgetFieldNamesToIds - chart filters', ()=>{
    it('resolves filter fieldName to fieldMetadataId', ()=>{
        const widget = buildAggregateWidget({
            recordFilters: [
                {
                    fieldName: 'stage',
                    operand: _types.ViewFilterOperand.IS,
                    value: '["WON"]'
                }
            ]
        });
        const result = (0, _resolvewidgetfieldnamestometadataidsutil.resolveWidgetFieldNamesToIds)(widget, buildMaps());
        expect(result.configuration).toMatchObject({
            aggregateFieldMetadataId: AMOUNT_FIELD_ID,
            filter: {
                recordFilters: [
                    {
                        fieldMetadataId: STAGE_FIELD_ID,
                        operand: _types.ViewFilterOperand.IS,
                        value: '["WON"]'
                    }
                ]
            }
        });
        expect(result.configuration.filter.recordFilters[0]).not.toHaveProperty('fieldName');
    });
    it('enriches the filter with a root group, type and displayValue for the UI', ()=>{
        const widget = buildAggregateWidget({
            recordFilters: [
                {
                    fieldName: 'stage',
                    operand: _types.ViewFilterOperand.IS_NOT,
                    value: '["NEW"]'
                }
            ]
        });
        const result = (0, _resolvewidgetfieldnamestometadataidsutil.resolveWidgetFieldNamesToIds)(widget, buildMaps());
        const filter = getResolvedFilter(result.configuration);
        expect(filter.recordFilterGroups).toHaveLength(1);
        const rootGroup = filter.recordFilterGroups[0];
        expect(rootGroup).toMatchObject({
            logicalOperator: 'AND'
        });
        expect(rootGroup.parentRecordFilterGroupId).toBeUndefined();
        expect(filter.recordFilters[0]).toMatchObject({
            fieldMetadataId: STAGE_FIELD_ID,
            operand: _types.ViewFilterOperand.IS_NOT,
            value: '["NEW"]',
            displayValue: '["NEW"]',
            type: 'SELECT',
            recordFilterGroupId: rootGroup.id,
            positionInRecordFilterGroup: 0
        });
        expect(filter.recordFilters[0].id).toEqual(expect.any(String));
    });
    it('preserves an explicit filter fieldMetadataId', ()=>{
        const widget = buildAggregateWidget({
            recordFilters: [
                {
                    fieldMetadataId: STAGE_FIELD_ID,
                    operand: _types.ViewFilterOperand.IS_NOT,
                    value: '["LOST"]'
                }
            ]
        });
        const result = (0, _resolvewidgetfieldnamestometadataidsutil.resolveWidgetFieldNamesToIds)(widget, buildMaps());
        expect(result.configuration).toMatchObject({
            filter: {
                recordFilters: [
                    {
                        fieldMetadataId: STAGE_FIELD_ID
                    }
                ]
            }
        });
    });
    it('passes relative date filter values through unchanged', ()=>{
        const widget = buildAggregateWidget({
            recordFilters: [
                {
                    fieldName: 'createdAt',
                    operand: _types.ViewFilterOperand.IS_RELATIVE,
                    value: 'PAST_7_DAY'
                }
            ]
        });
        const result = (0, _resolvewidgetfieldnamestometadataidsutil.resolveWidgetFieldNamesToIds)(widget, buildMaps());
        expect(result.configuration).toMatchObject({
            filter: {
                recordFilters: [
                    {
                        fieldMetadataId: CREATED_AT_FIELD_ID,
                        operand: _types.ViewFilterOperand.IS_RELATIVE,
                        value: 'PAST_7_DAY'
                    }
                ]
            }
        });
    });
    it('keeps recordFilterGroups for AND/OR logic', ()=>{
        const widget = buildAggregateWidget({
            recordFilters: [
                {
                    fieldName: 'stage',
                    operand: _types.ViewFilterOperand.IS,
                    value: '["WON"]',
                    recordFilterGroupId: 'group-1'
                }
            ],
            recordFilterGroups: [
                {
                    id: 'group-1',
                    logicalOperator: 'OR'
                }
            ]
        });
        const result = (0, _resolvewidgetfieldnamestometadataidsutil.resolveWidgetFieldNamesToIds)(widget, buildMaps());
        expect(result.configuration).toMatchObject({
            filter: {
                recordFilterGroups: [
                    {
                        id: 'group-1',
                        logicalOperator: 'OR'
                    }
                ]
            }
        });
    });
    it('throws a helpful error when a filter field name is unknown', ()=>{
        const widget = buildAggregateWidget({
            recordFilters: [
                {
                    fieldName: 'nonExistentField',
                    operand: _types.ViewFilterOperand.IS,
                    value: '["X"]'
                }
            ]
        });
        expect(()=>(0, _resolvewidgetfieldnamestometadataidsutil.resolveWidgetFieldNamesToIds)(widget, buildMaps())).toThrow(/Field "nonExistentField" not found/);
    });
});

//# sourceMappingURL=resolve-widget-field-names-to-metadata-ids.util.spec.js.map