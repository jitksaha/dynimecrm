"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _convertorderbytofindoptionsorder = require("../convert-order-by-to-find-options-order");
describe('convertOrderByToFindOptionsOrder', ()=>{
    it.each([
        [
            _types.OrderByDirection.AscNullsFirst,
            'ASC',
            'NULLS FIRST'
        ],
        [
            _types.OrderByDirection.AscNullsLast,
            'ASC',
            'NULLS LAST'
        ],
        [
            _types.OrderByDirection.DescNullsFirst,
            'DESC',
            'NULLS FIRST'
        ],
        [
            _types.OrderByDirection.DescNullsLast,
            'DESC',
            'NULLS LAST'
        ]
    ])('should keep %s as-is for forward pagination', (direction, order, nulls)=>{
        expect((0, _convertorderbytofindoptionsorder.convertOrderByToFindOptionsOrder)(direction, true)).toEqual({
            order,
            nulls
        });
    });
    // The backward scan is the exact reverse of the requested order, so the NULLS
    // placement reverses along with the direction
    it.each([
        [
            _types.OrderByDirection.AscNullsFirst,
            'DESC',
            'NULLS LAST'
        ],
        [
            _types.OrderByDirection.AscNullsLast,
            'DESC',
            'NULLS FIRST'
        ],
        [
            _types.OrderByDirection.DescNullsFirst,
            'ASC',
            'NULLS LAST'
        ],
        [
            _types.OrderByDirection.DescNullsLast,
            'ASC',
            'NULLS FIRST'
        ]
    ])('should fully reverse %s for backward pagination', (direction, order, nulls)=>{
        expect((0, _convertorderbytofindoptionsorder.convertOrderByToFindOptionsOrder)(direction, false)).toEqual({
            order,
            nulls
        });
    });
});

//# sourceMappingURL=convert-order-by-to-find-options-order.spec.js.map