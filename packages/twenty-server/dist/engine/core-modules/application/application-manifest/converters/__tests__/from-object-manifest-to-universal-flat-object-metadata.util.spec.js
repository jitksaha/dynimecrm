"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _fromobjectmanifesttouniversalflatobjectmetadatautil = require("../from-object-manifest-to-universal-flat-object-metadata.util");
const APP_UID = '11111111-1111-1111-1111-111111111111';
const OBJECT_UID = '22222222-2222-2222-2222-222222222222';
const LABEL_IDENTIFIER_FIELD_UID = '33333333-3333-3333-3333-333333333333';
const NOW = '2026-05-15T10:00:00.000Z';
const buildObjectManifest = (overrides)=>({
        universalIdentifier: OBJECT_UID,
        nameSingular: 'pet',
        namePlural: 'pets',
        labelSingular: 'Pet',
        labelPlural: 'Pets',
        fields: [],
        labelIdentifierFieldMetadataUniversalIdentifier: LABEL_IDENTIFIER_FIELD_UID,
        ...overrides
    });
describe('fromObjectManifestToUniversalFlatObjectMetadata', ()=>{
    describe('UI capability flags', ()=>{
        it('defaults isUICreatable and isUIEditable to true when omitted from the manifest', ()=>{
            const result = (0, _fromobjectmanifesttouniversalflatobjectmetadatautil.fromObjectManifestToUniversalFlatObjectMetadata)({
                objectManifest: buildObjectManifest({}),
                applicationUniversalIdentifier: APP_UID,
                now: NOW
            });
            expect(result.isUICreatable).toBe(true);
            expect(result.isUIEditable).toBe(true);
        });
        it('uses the manifest values when set to false', ()=>{
            const result = (0, _fromobjectmanifesttouniversalflatobjectmetadatautil.fromObjectManifestToUniversalFlatObjectMetadata)({
                objectManifest: buildObjectManifest({
                    isUICreatable: false,
                    isUIEditable: false
                }),
                applicationUniversalIdentifier: APP_UID,
                now: NOW
            });
            expect(result.isUICreatable).toBe(false);
            expect(result.isUIEditable).toBe(false);
        });
        it('keeps the two flags independent', ()=>{
            const result = (0, _fromobjectmanifesttouniversalflatobjectmetadatautil.fromObjectManifestToUniversalFlatObjectMetadata)({
                objectManifest: buildObjectManifest({
                    isUICreatable: false
                }),
                applicationUniversalIdentifier: APP_UID,
                now: NOW
            });
            expect(result.isUICreatable).toBe(false);
            expect(result.isUIEditable).toBe(true);
        });
    });
    describe('writability', ()=>{
        it('defaults to OPEN when omitted from the manifest', ()=>{
            const result = (0, _fromobjectmanifesttouniversalflatobjectmetadatautil.fromObjectManifestToUniversalFlatObjectMetadata)({
                objectManifest: buildObjectManifest({}),
                applicationUniversalIdentifier: APP_UID,
                now: NOW
            });
            expect(result.writability).toBe(_types.MetadataWritability.OPEN);
        });
        it('carries the manifest value through', ()=>{
            const result = (0, _fromobjectmanifesttouniversalflatobjectmetadatautil.fromObjectManifestToUniversalFlatObjectMetadata)({
                objectManifest: buildObjectManifest({
                    writability: _types.MetadataWritability.APPLICATION
                }),
                applicationUniversalIdentifier: APP_UID,
                now: NOW
            });
            expect(result.writability).toBe(_types.MetadataWritability.APPLICATION);
        });
    });
});

//# sourceMappingURL=from-object-manifest-to-universal-flat-object-metadata.util.spec.js.map