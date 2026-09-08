"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _filteroutemptychartbucketsutil = require("../filter-out-empty-chart-buckets.util");
describe('filterOutEmptyChartBuckets', ()=>{
    it('should return the input unchanged when shouldOmitEmptyBuckets is false', ()=>{
        const rawResults = [
            {
                groupByDimensionValues: [
                    null
                ],
                aggregateValue: 0
            }
        ];
        const result = (0, _filteroutemptychartbucketsutil.filterOutEmptyChartBuckets)({
            rawResults,
            shouldOmitEmptyBuckets: false
        });
        expect(result).toBe(rawResults);
    });
    it('should drop buckets whose primary dimension is null', ()=>{
        const result = (0, _filteroutemptychartbucketsutil.filterOutEmptyChartBuckets)({
            rawResults: [
                {
                    groupByDimensionValues: [
                        'Active'
                    ],
                    aggregateValue: 5
                },
                {
                    groupByDimensionValues: [
                        null
                    ],
                    aggregateValue: 3
                }
            ],
            shouldOmitEmptyBuckets: true
        });
        expect(result).toEqual([
            {
                groupByDimensionValues: [
                    'Active'
                ],
                aggregateValue: 5
            }
        ]);
    });
    it('should drop two-dimensional buckets whose secondary dimension is null', ()=>{
        const result = (0, _filteroutemptychartbucketsutil.filterOutEmptyChartBuckets)({
            rawResults: [
                {
                    groupByDimensionValues: [
                        '2024-01-01',
                        'Acme'
                    ],
                    aggregateValue: 5
                },
                {
                    groupByDimensionValues: [
                        '2024-01-01',
                        null
                    ],
                    aggregateValue: 3
                }
            ],
            shouldOmitEmptyBuckets: true
        });
        expect(result).toEqual([
            {
                groupByDimensionValues: [
                    '2024-01-01',
                    'Acme'
                ],
                aggregateValue: 5
            }
        ]);
    });
    it('should drop buckets with zero or non-finite aggregate values', ()=>{
        const result = (0, _filteroutemptychartbucketsutil.filterOutEmptyChartBuckets)({
            rawResults: [
                {
                    groupByDimensionValues: [
                        'Active'
                    ],
                    aggregateValue: 5
                },
                {
                    groupByDimensionValues: [
                        'Zero'
                    ],
                    aggregateValue: 0
                },
                {
                    groupByDimensionValues: [
                        'NaN'
                    ],
                    aggregateValue: Number.NaN
                }
            ],
            shouldOmitEmptyBuckets: true
        });
        expect(result).toEqual([
            {
                groupByDimensionValues: [
                    'Active'
                ],
                aggregateValue: 5
            }
        ]);
    });
    it('should drop buckets with no dimension values', ()=>{
        const result = (0, _filteroutemptychartbucketsutil.filterOutEmptyChartBuckets)({
            rawResults: [
                {
                    groupByDimensionValues: [],
                    aggregateValue: 5
                }
            ],
            shouldOmitEmptyBuckets: true
        });
        expect(result).toEqual([]);
    });
});

//# sourceMappingURL=filter-out-empty-chart-buckets.util.spec.js.map