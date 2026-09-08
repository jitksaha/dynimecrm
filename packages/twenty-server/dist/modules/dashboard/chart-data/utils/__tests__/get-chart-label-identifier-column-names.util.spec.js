"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getchartlabelidentifiercolumnnamesutil = require("../get-chart-label-identifier-column-names.util");
const labelFieldMetadataId = 'label-field-id';
const buildFlatFieldMetadataMaps = (labelField)=>({
        byUniversalIdentifier: {
            'label-field-universal-id': {
                id: labelFieldMetadataId,
                universalIdentifier: 'label-field-universal-id',
                ...labelField
            }
        },
        universalIdentifierById: {
            [labelFieldMetadataId]: 'label-field-universal-id'
        },
        universalIdentifiersByApplicationId: {}
    });
const buildFlatObjectMetadata = (labelIdentifierFieldMetadataId)=>({
        id: 'target-object-id',
        nameSingular: 'agent',
        labelIdentifierFieldMetadataId
    });
describe('getChartLabelIdentifierColumnNames', ()=>{
    it('should return id and the column name for a TEXT label identifier', ()=>{
        expect((0, _getchartlabelidentifiercolumnnamesutil.getChartLabelIdentifierColumnNames)({
            flatObjectMetadata: buildFlatObjectMetadata(labelFieldMetadataId),
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps({
                name: 'name',
                type: _types.FieldMetadataType.TEXT
            })
        })).toEqual([
            'id',
            'name'
        ]);
    });
    it('should return id and the column name for a UUID label identifier', ()=>{
        expect((0, _getchartlabelidentifiercolumnnamesutil.getChartLabelIdentifierColumnNames)({
            flatObjectMetadata: buildFlatObjectMetadata(labelFieldMetadataId),
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps({
                name: 'externalId',
                type: _types.FieldMetadataType.UUID
            })
        })).toEqual([
            'id',
            'externalId'
        ]);
    });
    it('should return id and the composite column names for a FULL_NAME label identifier', ()=>{
        expect((0, _getchartlabelidentifiercolumnnamesutil.getChartLabelIdentifierColumnNames)({
            flatObjectMetadata: buildFlatObjectMetadata(labelFieldMetadataId),
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps({
                name: 'name',
                type: _types.FieldMetadataType.FULL_NAME
            })
        })).toEqual([
            'id',
            'nameFirstName',
            'nameLastName'
        ]);
    });
    it('should return null when the object has no label identifier field', ()=>{
        expect((0, _getchartlabelidentifiercolumnnamesutil.getChartLabelIdentifierColumnNames)({
            flatObjectMetadata: buildFlatObjectMetadata(null),
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps({
                name: 'name',
                type: _types.FieldMetadataType.TEXT
            })
        })).toBeNull();
    });
    it('should return null when the label identifier is the id field itself', ()=>{
        expect((0, _getchartlabelidentifiercolumnnamesutil.getChartLabelIdentifierColumnNames)({
            flatObjectMetadata: buildFlatObjectMetadata(labelFieldMetadataId),
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps({
                name: 'id',
                type: _types.FieldMetadataType.UUID
            })
        })).toBeNull();
    });
});

//# sourceMappingURL=get-chart-label-identifier-column-names.util.spec.js.map