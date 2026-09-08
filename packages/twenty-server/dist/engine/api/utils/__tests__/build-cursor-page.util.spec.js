"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildcursorpageutil = require("../build-cursor-page.util");
describe('buildCursorPage', ()=>{
    it('trims a forward sentinel without mutating the fetched items', ()=>{
        const fetchedItems = [
            'd',
            'c',
            'b'
        ];
        expect((0, _buildcursorpageutil.buildCursorPage)({
            fetchedItems,
            limit: 2,
            direction: 'forward'
        })).toEqual({
            items: [
                'd',
                'c'
            ],
            pageInfo: {
                hasNextPage: true,
                hasPreviousPage: false
            }
        });
        expect(fetchedItems).toEqual([
            'd',
            'c',
            'b'
        ]);
    });
    it('restores presentation order for a backward page', ()=>{
        expect((0, _buildcursorpageutil.buildCursorPage)({
            fetchedItems: [
                'b',
                'c',
                'd'
            ],
            limit: 2,
            direction: 'backward',
            hasBeforeCursor: true
        })).toEqual({
            items: [
                'c',
                'b'
            ],
            pageInfo: {
                hasNextPage: true,
                hasPreviousPage: true
            }
        });
    });
    it('reports the opposite side when paging from a cursor', ()=>{
        expect((0, _buildcursorpageutil.buildCursorPage)({
            fetchedItems: [
                'c'
            ],
            limit: 2,
            direction: 'forward',
            hasAfterCursor: true
        }).pageInfo).toEqual({
            hasNextPage: false,
            hasPreviousPage: true
        });
    });
});

//# sourceMappingURL=build-cursor-page.util.spec.js.map