"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _graphorderbyenum = require("../../../../../engine/metadata-modules/page-layout-widget/enums/graph-order-by.enum");
const _sortbarchartsecondaryaxiskeysutil = require("../sort-bar-chart-secondary-axis-keys.util");
const buildConfiguration = (configuration)=>configuration;
const textGroupByField = {
    type: _types.FieldMetadataType.TEXT
};
const emptyLookup = new Map();
describe('sortBarChartSecondaryAxisKeys', ()=>{
    it('should return the keys untouched when no order by is configured', ()=>{
        const keys = [
            'b',
            'a',
            'c'
        ];
        const result = (0, _sortbarchartsecondaryaxiskeysutil.sortBarChartSecondaryAxisKeys)({
            keys,
            data: [],
            configuration: buildConfiguration({}),
            secondaryFormattedToRawLookup: emptyLookup,
            secondarySelectOptions: null,
            secondaryAxisGroupByField: textGroupByField
        });
        expect(result).toEqual([
            'b',
            'a',
            'c'
        ]);
    });
    it('should sort keys alphabetically ascending', ()=>{
        const result = (0, _sortbarchartsecondaryaxiskeysutil.sortBarChartSecondaryAxisKeys)({
            keys: [
                'charlie',
                'alpha',
                'bravo'
            ],
            data: [],
            configuration: buildConfiguration({
                secondaryAxisOrderBy: _graphorderbyenum.GraphOrderBy.FIELD_ASC
            }),
            secondaryFormattedToRawLookup: emptyLookup,
            secondarySelectOptions: null,
            secondaryAxisGroupByField: textGroupByField
        });
        expect(result).toEqual([
            'alpha',
            'bravo',
            'charlie'
        ]);
    });
    it('should sort keys alphabetically descending', ()=>{
        const result = (0, _sortbarchartsecondaryaxiskeysutil.sortBarChartSecondaryAxisKeys)({
            keys: [
                'charlie',
                'alpha',
                'bravo'
            ],
            data: [],
            configuration: buildConfiguration({
                secondaryAxisOrderBy: _graphorderbyenum.GraphOrderBy.FIELD_DESC
            }),
            secondaryFormattedToRawLookup: emptyLookup,
            secondarySelectOptions: null,
            secondaryAxisGroupByField: textGroupByField
        });
        expect(result).toEqual([
            'charlie',
            'bravo',
            'alpha'
        ]);
    });
    it('should sort by the summed value across every data row', ()=>{
        const result = (0, _sortbarchartsecondaryaxiskeysutil.sortBarChartSecondaryAxisKeys)({
            keys: [
                'low',
                'high'
            ],
            data: [
                {
                    low: 1,
                    high: 10
                },
                {
                    low: 2,
                    high: 20
                }
            ],
            configuration: buildConfiguration({
                secondaryAxisOrderBy: _graphorderbyenum.GraphOrderBy.VALUE_DESC
            }),
            secondaryFormattedToRawLookup: emptyLookup,
            secondarySelectOptions: null,
            secondaryAxisGroupByField: textGroupByField
        });
        expect(result).toEqual([
            'high',
            'low'
        ]);
    });
    it('should ignore non numeric cells when summing values', ()=>{
        const result = (0, _sortbarchartsecondaryaxiskeysutil.sortBarChartSecondaryAxisKeys)({
            keys: [
                'a',
                'b'
            ],
            data: [
                {
                    a: 5,
                    b: 'not-a-number'
                },
                {
                    a: 5,
                    b: 1
                }
            ],
            configuration: buildConfiguration({
                secondaryAxisOrderBy: _graphorderbyenum.GraphOrderBy.VALUE_DESC
            }),
            secondaryFormattedToRawLookup: emptyLookup,
            secondarySelectOptions: null,
            secondaryAxisGroupByField: textGroupByField
        });
        expect(result).toEqual([
            'a',
            'b'
        ]);
    });
    it('should treat a key absent from the data as zero', ()=>{
        const result = (0, _sortbarchartsecondaryaxiskeysutil.sortBarChartSecondaryAxisKeys)({
            keys: [
                'present',
                'absent'
            ],
            data: [
                {
                    present: 3
                }
            ],
            configuration: buildConfiguration({
                secondaryAxisOrderBy: _graphorderbyenum.GraphOrderBy.VALUE_DESC
            }),
            secondaryFormattedToRawLookup: emptyLookup,
            secondarySelectOptions: null,
            secondaryAxisGroupByField: textGroupByField
        });
        expect(result).toEqual([
            'present',
            'absent'
        ]);
    });
});

//# sourceMappingURL=sort-bar-chart-secondary-axis-keys.util.spec.js.map