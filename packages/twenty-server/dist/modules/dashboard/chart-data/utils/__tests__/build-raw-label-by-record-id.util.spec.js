"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _buildrawlabelbyrecordidutil = require("../build-raw-label-by-record-id.util");
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
const targetFlatObjectMetadata = {
    id: 'target-object-id',
    nameSingular: 'agent',
    labelIdentifierFieldMetadataId: labelFieldMetadataId
};
describe('buildRawLabelByRecordId', ()=>{
    it('should build labels from a TEXT label identifier', ()=>{
        const rawLabelByRecordId = (0, _buildrawlabelbyrecordidutil.buildRawLabelByRecordId)({
            records: [
                {
                    id: 'agent-id-1',
                    name: 'Alice'
                },
                {
                    id: 'agent-id-2',
                    name: 'Bob'
                }
            ],
            targetFlatObjectMetadata,
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps({
                name: 'name',
                type: _types.FieldMetadataType.TEXT
            })
        });
        expect(rawLabelByRecordId.get('agent-id-1')).toBe('Alice');
        expect(rawLabelByRecordId.get('agent-id-2')).toBe('Bob');
    });
    it('should join FULL_NAME subfields into a single label', ()=>{
        const rawLabelByRecordId = (0, _buildrawlabelbyrecordidutil.buildRawLabelByRecordId)({
            records: [
                {
                    id: 'agent-id-1',
                    name: {
                        firstName: 'Alice',
                        lastName: 'Ng'
                    }
                }
            ],
            targetFlatObjectMetadata,
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps({
                name: 'name',
                type: _types.FieldMetadataType.FULL_NAME
            })
        });
        expect(rawLabelByRecordId.get('agent-id-1')).toBe('Alice Ng');
    });
    it('should skip records whose label identifier value is empty', ()=>{
        const rawLabelByRecordId = (0, _buildrawlabelbyrecordidutil.buildRawLabelByRecordId)({
            records: [
                {
                    id: 'agent-id-1',
                    name: null
                }
            ],
            targetFlatObjectMetadata,
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps({
                name: 'name',
                type: _types.FieldMetadataType.TEXT
            })
        });
        expect(rawLabelByRecordId.has('agent-id-1')).toBe(false);
    });
    it('should keep a UUID label whose value equals the record id', ()=>{
        const rawLabelByRecordId = (0, _buildrawlabelbyrecordidutil.buildRawLabelByRecordId)({
            records: [
                {
                    id: 'agent-id-1',
                    externalId: 'agent-id-1'
                }
            ],
            targetFlatObjectMetadata,
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps({
                name: 'externalId',
                type: _types.FieldMetadataType.UUID
            })
        });
        expect(rawLabelByRecordId.get('agent-id-1')).toBe('agent-id-1');
    });
});

//# sourceMappingURL=build-raw-label-by-record-id.util.spec.js.map