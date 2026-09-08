"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _filteroutunresolvedrelationbucketsutil = require("../filter-out-unresolved-relation-buckets.util");
const buildResolution = (unresolvedRecordIds)=>({
        labelByRecordId: new Map(),
        unresolvedRecordIds: new Set(unresolvedRecordIds)
    });
describe('filterOutUnresolvedRelationBuckets', ()=>{
    it('should drop rows whose primary dimension is unresolved', ()=>{
        const rawResults = [
            {
                groupByDimensionValues: [
                    'agent-id-1'
                ],
                aggregateValue: 8
            },
            {
                groupByDimensionValues: [
                    'agent-id-2'
                ],
                aggregateValue: 5
            }
        ];
        const result = (0, _filteroutunresolvedrelationbucketsutil.filterOutUnresolvedRelationBuckets)({
            rawResults,
            primaryRelationLabelResolution: buildResolution([
                'agent-id-2'
            ]),
            secondaryRelationLabelResolution: undefined
        });
        expect(result).toEqual([
            {
                groupByDimensionValues: [
                    'agent-id-1'
                ],
                aggregateValue: 8
            }
        ]);
    });
    it('should drop rows whose secondary dimension is unresolved', ()=>{
        const rawResults = [
            {
                groupByDimensionValues: [
                    '2024-01-01',
                    'agent-id-1'
                ],
                aggregateValue: 8
            },
            {
                groupByDimensionValues: [
                    '2024-01-01',
                    'agent-id-2'
                ],
                aggregateValue: 5
            }
        ];
        const result = (0, _filteroutunresolvedrelationbucketsutil.filterOutUnresolvedRelationBuckets)({
            rawResults,
            primaryRelationLabelResolution: undefined,
            secondaryRelationLabelResolution: buildResolution([
                'agent-id-2'
            ])
        });
        expect(result).toEqual([
            {
                groupByDimensionValues: [
                    '2024-01-01',
                    'agent-id-1'
                ],
                aggregateValue: 8
            }
        ]);
    });
    it('should keep null "Not Set" rows', ()=>{
        const rawResults = [
            {
                groupByDimensionValues: [
                    null
                ],
                aggregateValue: 3
            },
            {
                groupByDimensionValues: [
                    'agent-id-2'
                ],
                aggregateValue: 5
            }
        ];
        const result = (0, _filteroutunresolvedrelationbucketsutil.filterOutUnresolvedRelationBuckets)({
            rawResults,
            primaryRelationLabelResolution: buildResolution([
                'agent-id-2'
            ]),
            secondaryRelationLabelResolution: undefined
        });
        expect(result).toEqual([
            {
                groupByDimensionValues: [
                    null
                ],
                aggregateValue: 3
            }
        ]);
    });
    it('should return the input unchanged when no resolution is provided', ()=>{
        const rawResults = [
            {
                groupByDimensionValues: [
                    'agent-id-1'
                ],
                aggregateValue: 8
            },
            {
                groupByDimensionValues: [
                    'agent-id-2'
                ],
                aggregateValue: 5
            }
        ];
        const result = (0, _filteroutunresolvedrelationbucketsutil.filterOutUnresolvedRelationBuckets)({
            rawResults,
            primaryRelationLabelResolution: undefined,
            secondaryRelationLabelResolution: undefined
        });
        expect(result).toBe(rawResults);
    });
    it('should only apply the secondary resolution when the primary axis is not a relation', ()=>{
        const rawResults = [
            {
                groupByDimensionValues: [
                    'agent-id-2',
                    'agent-id-1'
                ],
                aggregateValue: 8
            },
            {
                groupByDimensionValues: [
                    'agent-id-1',
                    'agent-id-2'
                ],
                aggregateValue: 5
            }
        ];
        const result = (0, _filteroutunresolvedrelationbucketsutil.filterOutUnresolvedRelationBuckets)({
            rawResults,
            primaryRelationLabelResolution: undefined,
            secondaryRelationLabelResolution: buildResolution([
                'agent-id-2'
            ])
        });
        expect(result).toEqual([
            {
                groupByDimensionValues: [
                    'agent-id-2',
                    'agent-id-1'
                ],
                aggregateValue: 8
            }
        ]);
    });
});

//# sourceMappingURL=filter-out-unresolved-relation-buckets.util.spec.js.map