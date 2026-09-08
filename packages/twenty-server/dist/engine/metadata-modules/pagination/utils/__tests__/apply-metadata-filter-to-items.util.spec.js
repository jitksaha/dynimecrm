"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _graphqlerrorsutil = require("../../../../core-modules/graphql/utils/graphql-errors.util");
const _applymetadatafiltertoitemsutil = require("../apply-metadata-filter-to-items.util");
describe('applyMetadataFilterToItems', ()=>{
    it('applies nested filters to batched in-memory relations', ()=>{
        const items = [
            {
                id: 'a',
                isActive: true
            },
            {
                id: 'b',
                isActive: false
            },
            {
                id: 'c',
                isActive: true
            }
        ];
        expect((0, _applymetadatafiltertoitemsutil.applyMetadataFilterToItems)({
            items,
            filter: {
                and: [
                    {
                        isActive: {
                            is: true
                        }
                    }
                ],
                id: {
                    gt: 'a',
                    lt: 'c'
                }
            },
            columnByFilterField: {
                id: {
                    column: 'id',
                    type: 'uuid'
                },
                isActive: {
                    column: 'isActive',
                    type: 'boolean'
                }
            }
        })).toEqual([]);
    });
    it('matches UUID filters regardless of operand casing', ()=>{
        const items = [
            {
                id: '00000000-0000-4000-8000-00000000000a'
            }
        ];
        const columnByFilterField = {
            id: {
                column: 'id',
                type: 'uuid'
            }
        };
        const upperCasedId = items[0].id.toUpperCase();
        const matching = (filter)=>(0, _applymetadatafiltertoitemsutil.applyMetadataFilterToItems)({
                items,
                filter,
                columnByFilterField
            });
        expect(matching({
            id: {
                eq: upperCasedId
            }
        })).toEqual(items);
        expect(matching({
            id: {
                in: [
                    upperCasedId
                ]
            }
        })).toEqual(items);
        expect(matching({
            id: {
                neq: upperCasedId
            }
        })).toEqual([]);
        expect(matching({
            id: {
                notIn: [
                    upperCasedId
                ]
            }
        })).toEqual([]);
    });
    it('inverts aliased boolean columns', ()=>{
        const items = [
            {
                id: 'a',
                isUIEditable: false
            }
        ];
        expect((0, _applymetadatafiltertoitemsutil.applyMetadataFilterToItems)({
            items,
            filter: {
                isUIReadOnly: {
                    is: true
                }
            },
            columnByFilterField: {
                isUIReadOnly: {
                    column: 'isUIEditable',
                    type: 'boolean',
                    invertBooleanValues: true
                }
            }
        })).toEqual(items);
    });
    it('rejects unknown filter fields', ()=>{
        expect(()=>(0, _applymetadatafiltertoitemsutil.applyMetadataFilterToItems)({
                items: [
                    {
                        id: 'a'
                    }
                ],
                filter: {
                    unknownField: {
                        eq: 'a'
                    }
                },
                columnByFilterField: {}
            })).toThrow(_graphqlerrorsutil.UserInputError);
    });
});

//# sourceMappingURL=apply-metadata-filter-to-items.util.spec.js.map