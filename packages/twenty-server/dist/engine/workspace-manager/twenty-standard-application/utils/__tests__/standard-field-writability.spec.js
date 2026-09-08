"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _twentystandardapplicationallflatentitymapsconstant = require("../twenty-standard-application-all-flat-entity-maps.constant");
const WORKSPACE_ID = '20202020-1111-4111-8111-111111111111';
const TWENTY_STANDARD_APPLICATION_ID = '20202020-2222-4222-8222-222222222222';
const NOW = '2024-01-01T00:00:00.000Z';
describe('Standard field writability', ()=>{
    const { allFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
        now: NOW,
        workspaceId: WORKSPACE_ID,
        twentyStandardApplicationId: TWENTY_STANDARD_APPLICATION_ID
    });
    const standardFlatFieldMetadatas = Object.values(allFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined);
    const searchVectorFlatFieldMetadatas = standardFlatFieldMetadatas.filter((flatFieldMetadata)=>flatFieldMetadata.type === _types.FieldMetadataType.TS_VECTOR);
    it('marks every search vector field as SYSTEM, since Postgres generates the column', ()=>{
        expect(searchVectorFlatFieldMetadatas.length).toBeGreaterThan(0);
        expect(searchVectorFlatFieldMetadatas.every((flatFieldMetadata)=>flatFieldMetadata.writability === _types.MetadataWritability.SYSTEM)).toBe(true);
    });
    it('leaves every other standard field OPEN', ()=>{
        const nonSearchVectorWritabilities = new Set(standardFlatFieldMetadatas.filter((flatFieldMetadata)=>flatFieldMetadata.type !== _types.FieldMetadataType.TS_VECTOR).map((flatFieldMetadata)=>flatFieldMetadata.writability));
        expect([
            ...nonSearchVectorWritabilities
        ]).toEqual([
            _types.MetadataWritability.OPEN
        ]);
    });
});

//# sourceMappingURL=standard-field-writability.spec.js.map