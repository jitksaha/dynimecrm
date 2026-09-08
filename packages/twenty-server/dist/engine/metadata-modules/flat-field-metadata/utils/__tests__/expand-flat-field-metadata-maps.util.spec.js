"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _compactflatfieldmetadatamapsutil = require("../compact-flat-field-metadata-maps.util");
const _expandflatfieldmetadatamapsutil = require("../expand-flat-field-metadata-maps.util");
const expandOne = (compactFlatFieldMetadata)=>(0, _expandflatfieldmetadatamapsutil.expandFlatFieldMetadataMaps)({
        byUniversalIdentifier: {
            'field-uid': compactFlatFieldMetadata
        },
        universalIdentifierById: {},
        universalIdentifiersByApplicationId: {}
    }).byUniversalIdentifier['field-uid'];
const compactOne = (flatFieldMetadata)=>(0, _compactflatfieldmetadatamapsutil.compactFlatFieldMetadataMaps)({
        byUniversalIdentifier: {
            'field-uid': flatFieldMetadata
        },
        universalIdentifierById: {},
        universalIdentifiersByApplicationId: {}
    });
describe('expandFlatFieldMetadataMaps', ()=>{
    it('should restore a short code to its full key', ()=>{
        expect(expandOne({
            $r: 'firstName'
        })).toMatchObject({
            name: 'firstName'
        });
    });
    it('should restore an omitted relation array as empty', ()=>{
        expect(expandOne({})).toMatchObject({
            viewFieldIds: []
        });
    });
    it('should keep an expanded relation array over the empty default', ()=>{
        expect(expandOne({
            $H: [
                'view-field-1'
            ]
        })).toMatchObject({
            viewFieldIds: [
                'view-field-1'
            ]
        });
    });
    it('should round trip a field through JSON, as the cache storage layer does', ()=>{
        const compacted = JSON.parse(JSON.stringify(compactOne({
            name: 'firstName',
            viewFieldIds: [
                'view-field-1'
            ],
            viewFilterIds: []
        })));
        expect((0, _expandflatfieldmetadatamapsutil.expandFlatFieldMetadataMaps)(compacted).byUniversalIdentifier).toMatchObject({
            'field-uid': {
                name: 'firstName',
                viewFieldIds: [
                    'view-field-1'
                ],
                viewFilterIds: []
            }
        });
    });
});

//# sourceMappingURL=expand-flat-field-metadata-maps.util.spec.js.map