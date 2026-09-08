"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _splitviewfieldpositionupdatesutil = require("../split-view-field-position-updates.util");
describe('splitViewFieldPositionUpdates', ()=>{
    it('should hold back the column that ends up lowest', ()=>{
        expect((0, _splitviewfieldpositionupdatesutil.splitViewFieldPositionUpdates)([
            {
                universalIdentifier: 'name',
                position: 0
            },
            {
                universalIdentifier: 'subject',
                position: 1
            },
            {
                universalIdentifier: 'status',
                position: 2
            }
        ])).toEqual({
            others: [
                {
                    universalIdentifier: 'subject',
                    position: 1
                },
                {
                    universalIdentifier: 'status',
                    position: 2
                }
            ],
            lowest: [
                {
                    universalIdentifier: 'name',
                    position: 0
                }
            ]
        });
    });
    it('should hold it back regardless of where it sits in the input', ()=>{
        expect((0, _splitviewfieldpositionupdatesutil.splitViewFieldPositionUpdates)([
            {
                universalIdentifier: 'status',
                position: 2
            },
            {
                universalIdentifier: 'name',
                position: 0
            }
        ]).lowest).toEqual([
            {
                universalIdentifier: 'name',
                position: 0
            }
        ]);
    });
    it('should handle negative positions', ()=>{
        expect((0, _splitviewfieldpositionupdatesutil.splitViewFieldPositionUpdates)([
            {
                universalIdentifier: 'subject',
                position: 1
            },
            {
                universalIdentifier: 'name',
                position: -1
            }
        ]).lowest).toEqual([
            {
                universalIdentifier: 'name',
                position: -1
            }
        ]);
    });
    it('should pass a single update straight through', ()=>{
        expect((0, _splitviewfieldpositionupdatesutil.splitViewFieldPositionUpdates)([
            {
                universalIdentifier: 'subject',
                position: 1
            }
        ])).toEqual({
            others: [],
            lowest: [
                {
                    universalIdentifier: 'subject',
                    position: 1
                }
            ]
        });
    });
    it('should return empty batches for no updates', ()=>{
        expect((0, _splitviewfieldpositionupdatesutil.splitViewFieldPositionUpdates)([])).toEqual({
            others: [],
            lowest: []
        });
    });
    it('should never leave a column below the held-back one in the first batch', ()=>{
        const { others, lowest } = (0, _splitviewfieldpositionupdatesutil.splitViewFieldPositionUpdates)([
            {
                universalIdentifier: 'a',
                position: 3
            },
            {
                universalIdentifier: 'b',
                position: -2
            },
            {
                universalIdentifier: 'c',
                position: 0
            }
        ]);
        others.forEach(({ position })=>{
            expect(position).toBeGreaterThan(lowest[0].position);
        });
    });
});

//# sourceMappingURL=split-view-field-position-updates.util.spec.js.map