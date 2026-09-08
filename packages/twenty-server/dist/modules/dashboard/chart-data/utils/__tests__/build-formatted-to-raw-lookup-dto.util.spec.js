"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildformattedtorawlookupdtoutil = require("../build-formatted-to-raw-lookup-dto.util");
const buildResolution = (unresolvedRecordIds)=>({
        labelByRecordId: new Map(),
        unresolvedRecordIds
    });
describe('buildFormattedToRawLookupDto', ()=>{
    const lookup = new Map([
        [
            'Alice',
            'agent-id-1'
        ],
        [
            'Unknown',
            'agent-id-2'
        ]
    ]);
    it('should keep every entry without an unresolved set', ()=>{
        expect((0, _buildformattedtorawlookupdtoutil.buildFormattedToRawLookupDto)({
            axisLookups: [
                {
                    formattedToRawLookup: lookup,
                    relationLabelResolution: undefined
                }
            ]
        })).toEqual({
            Alice: 'agent-id-1',
            Unknown: 'agent-id-2'
        });
    });
    it('should strip entries whose raw value is unresolved on their own axis', ()=>{
        expect((0, _buildformattedtorawlookupdtoutil.buildFormattedToRawLookupDto)({
            axisLookups: [
                {
                    formattedToRawLookup: lookup,
                    relationLabelResolution: buildResolution(new Set([
                        'agent-id-2'
                    ]))
                }
            ]
        })).toEqual({
            Alice: 'agent-id-1'
        });
    });
    it('should not strip an entry matching another axis unresolved record id', ()=>{
        expect((0, _buildformattedtorawlookupdtoutil.buildFormattedToRawLookupDto)({
            axisLookups: [
                {
                    formattedToRawLookup: new Map([
                        [
                            '2024-01-01',
                            'agent-id-1'
                        ]
                    ]),
                    relationLabelResolution: undefined
                },
                {
                    formattedToRawLookup: lookup,
                    relationLabelResolution: buildResolution(new Set([
                        'agent-id-2'
                    ]))
                }
            ]
        })).toEqual({
            '2024-01-01': 'agent-id-1',
            Alice: 'agent-id-1'
        });
    });
    it('should keep an entry whose formatted value is __proto__', ()=>{
        const result = (0, _buildformattedtorawlookupdtoutil.buildFormattedToRawLookupDto)({
            axisLookups: [
                {
                    formattedToRawLookup: new Map([
                        [
                            '__proto__',
                            'agent-id-1'
                        ]
                    ]),
                    relationLabelResolution: undefined
                }
            ]
        });
        expect(Object.entries(result)).toEqual([
            [
                '__proto__',
                'agent-id-1'
            ]
        ]);
    });
    it('should let later axis entries win formatted key collisions', ()=>{
        expect((0, _buildformattedtorawlookupdtoutil.buildFormattedToRawLookupDto)({
            axisLookups: [
                {
                    formattedToRawLookup: new Map([
                        [
                            'Alice',
                            'secondary-id'
                        ]
                    ]),
                    relationLabelResolution: undefined
                },
                {
                    formattedToRawLookup: lookup,
                    relationLabelResolution: buildResolution(new Set([
                        'agent-id-2'
                    ]))
                }
            ]
        })).toEqual({
            Alice: 'agent-id-1'
        });
    });
});

//# sourceMappingURL=build-formatted-to-raw-lookup-dto.util.spec.js.map