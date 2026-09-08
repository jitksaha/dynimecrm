"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _compactflatfieldmetadatamapsutil = require("../compact-flat-field-metadata-maps.util");
const compactOne = (flatFieldMetadata)=>(0, _compactflatfieldmetadatamapsutil.compactFlatFieldMetadataMaps)({
        byUniversalIdentifier: {
            'field-uid': flatFieldMetadata
        },
        universalIdentifierById: {},
        universalIdentifiersByApplicationId: {}
    }).byUniversalIdentifier['field-uid'];
describe('compactFlatFieldMetadataMaps', ()=>{
    it('should replace a mapped key with its short code', ()=>{
        expect(compactOne({
            name: 'firstName'
        })).toEqual({
            $r: 'firstName'
        });
    });
    it('should drop a relation array that is empty', ()=>{
        expect(compactOne({
            viewFieldIds: []
        })).toEqual({});
    });
    it('should keep a relation array that is populated', ()=>{
        expect(compactOne({
            viewFieldIds: [
                'view-field-1'
            ]
        })).toEqual({
            $H: [
                'view-field-1'
            ]
        });
    });
});

//# sourceMappingURL=compact-flat-field-metadata-maps.util.spec.js.map