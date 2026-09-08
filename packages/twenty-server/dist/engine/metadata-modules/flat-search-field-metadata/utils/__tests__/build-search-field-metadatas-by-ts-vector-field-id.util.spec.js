"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildsearchfieldmetadatasbytsvectorfieldidutil = require("../build-search-field-metadatas-by-ts-vector-field-id.util");
const _gettargetsearchfieldmetadatasfortsvectorfieldutil = require("../get-target-search-field-metadatas-for-ts-vector-field.util");
const buildFlatSearchFieldMetadata = (overrides)=>({
        id: overrides.universalIdentifier,
        tsVectorFieldMetadataId: 'ts-vector-1',
        fieldMetadataId: 'field-1',
        position: 0,
        ...overrides
    });
const buildMaps = (flatSearchFieldMetadatas)=>({
        byUniversalIdentifier: Object.fromEntries(flatSearchFieldMetadatas.map((flatSearchFieldMetadata)=>[
                flatSearchFieldMetadata.universalIdentifier,
                flatSearchFieldMetadata
            ])),
        universalIdentifierById: {},
        universalIdentifiersByApplicationId: {}
    });
describe('buildSearchFieldMetadatasByTsVectorFieldId', ()=>{
    it('groups search fields by their tsVector field id', ()=>{
        const a1 = buildFlatSearchFieldMetadata({
            universalIdentifier: 'a1',
            tsVectorFieldMetadataId: 'ts-vector-a'
        });
        const a2 = buildFlatSearchFieldMetadata({
            universalIdentifier: 'a2',
            tsVectorFieldMetadataId: 'ts-vector-a'
        });
        const b1 = buildFlatSearchFieldMetadata({
            universalIdentifier: 'b1',
            tsVectorFieldMetadataId: 'ts-vector-b'
        });
        const grouped = (0, _buildsearchfieldmetadatasbytsvectorfieldidutil.buildSearchFieldMetadatasByTsVectorFieldId)(buildMaps([
            a1,
            a2,
            b1
        ]));
        expect(grouped.get('ts-vector-a')).toEqual([
            a1,
            a2
        ]);
        expect(grouped.get('ts-vector-b')).toEqual([
            b1
        ]);
        expect(grouped.get('ts-vector-unknown')).toBeUndefined();
    });
    it('matches the one-off filter helper for a given tsVector field', ()=>{
        const maps = buildMaps([
            buildFlatSearchFieldMetadata({
                universalIdentifier: 'a1',
                tsVectorFieldMetadataId: 'ts-vector-a'
            }),
            buildFlatSearchFieldMetadata({
                universalIdentifier: 'b1',
                tsVectorFieldMetadataId: 'ts-vector-b'
            })
        ]);
        const grouped = (0, _buildsearchfieldmetadatasbytsvectorfieldidutil.buildSearchFieldMetadatasByTsVectorFieldId)(maps);
        expect(grouped.get('ts-vector-a')).toEqual((0, _gettargetsearchfieldmetadatasfortsvectorfieldutil.getTargetSearchFieldMetadatasForTsVectorField)({
            tsVectorFieldMetadataId: 'ts-vector-a',
            flatSearchFieldMetadataMaps: maps
        }));
    });
    it('ignores undefined map entries', ()=>{
        const maps = buildMaps([
            buildFlatSearchFieldMetadata({
                universalIdentifier: 'a1',
                tsVectorFieldMetadataId: 'ts-vector-a'
            })
        ]);
        maps.byUniversalIdentifier['ghost'] = undefined;
        const grouped = (0, _buildsearchfieldmetadatasbytsvectorfieldidutil.buildSearchFieldMetadatasByTsVectorFieldId)(maps);
        expect(grouped.get('ts-vector-a')).toHaveLength(1);
        expect(grouped.size).toBe(1);
    });
});

//# sourceMappingURL=build-search-field-metadatas-by-ts-vector-field-id.util.spec.js.map