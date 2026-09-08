"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _buildsearchvectorflatfieldmetadataforcustomobjectutil = require("../build-search-vector-flat-field-metadata-for-custom-object.util");
describe('buildSearchVectorFlatFieldMetadataForCustomObject', ()=>{
    const searchVector = (0, _buildsearchvectorflatfieldmetadataforcustomobjectutil.buildSearchVectorFlatFieldMetadataForCustomObject)({
        flatObjectMetadata: {
            universalIdentifier: '20202020-1111-4111-8111-111111111111',
            applicationUniversalIdentifier: '20202020-2222-4222-8222-222222222222'
        }
    });
    it('marks the search vector field as SYSTEM, since Postgres generates the column', ()=>{
        expect(searchVector.writability).toBe(_types.MetadataWritability.SYSTEM);
    });
});

//# sourceMappingURL=build-search-vector-flat-field-metadata-for-custom-object.util.spec.js.map