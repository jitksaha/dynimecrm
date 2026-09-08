"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getrecordimageidentifierutil = require("../get-record-image-identifier.util");
const _getflatfieldmetadatamock = require("../../../../metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _getflatobjectmetadatamock = require("../../../../metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const buildFieldMaps = (fields)=>{
    const byUniversalIdentifier = {};
    const universalIdentifierById = {};
    for (const field of fields){
        byUniversalIdentifier[field.universalIdentifier] = field;
        universalIdentifierById[field.id] = field.universalIdentifier;
    }
    return {
        byUniversalIdentifier,
        universalIdentifierById,
        universalIdentifiersByApplicationId: {}
    };
};
const signUrl = (fileId, fileFolder)=>`signed:${fileFolder}:${fileId}`;
describe('getRecordImageIdentifier', ()=>{
    it('resolves a LINKS image identifier to a favicon url', async ()=>{
        const domainNameField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'domain-ui',
            objectMetadataId: 'company-id',
            id: 'domain-id',
            name: 'domainName',
            type: _types.FieldMetadataType.LINKS
        });
        const company = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'company-ui',
            id: 'company-id',
            nameSingular: 'company',
            imageIdentifierFieldMetadataId: 'domain-id'
        });
        const result = await (0, _getrecordimageidentifierutil.getRecordImageIdentifier)({
            record: {
                domainName: {
                    primaryLinkUrl: 'twenty.com'
                }
            },
            flatObjectMetadata: company,
            flatFieldMetadataMaps: buildFieldMaps([
                domainNameField
            ]),
            allowRequestsToTwentyIcons: true
        });
        expect(result).toBe('https://twenty-icons.com/twenty.com');
    });
    it('returns null for a LINKS image identifier when twenty-icons requests are disabled', async ()=>{
        const domainNameField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'domain-ui',
            objectMetadataId: 'company-id',
            id: 'domain-id',
            name: 'domainName',
            type: _types.FieldMetadataType.LINKS
        });
        const company = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'company-ui',
            id: 'company-id',
            nameSingular: 'company',
            imageIdentifierFieldMetadataId: 'domain-id'
        });
        const result = await (0, _getrecordimageidentifierutil.getRecordImageIdentifier)({
            record: {
                domainName: {
                    primaryLinkUrl: 'twenty.com'
                }
            },
            flatObjectMetadata: company,
            flatFieldMetadataMaps: buildFieldMaps([
                domainNameField
            ]),
            allowRequestsToTwentyIcons: false
        });
        expect(result).toBe(null);
    });
    it('resolves a FILES image identifier to a signed url', async ()=>{
        const avatarFileField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'avatar-ui',
            objectMetadataId: 'person-id',
            id: 'avatar-id',
            name: 'avatarFile',
            type: _types.FieldMetadataType.FILES
        });
        const person = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'person-ui',
            id: 'person-id',
            nameSingular: 'person',
            imageIdentifierFieldMetadataId: 'avatar-id'
        });
        const result = await (0, _getrecordimageidentifierutil.getRecordImageIdentifier)({
            record: {
                avatarFile: [
                    {
                        fileId: 'file-1'
                    }
                ]
            },
            flatObjectMetadata: person,
            flatFieldMetadataMaps: buildFieldMaps([
                avatarFileField
            ]),
            allowRequestsToTwentyIcons: true,
            signUrl
        });
        expect(result).toBe(`signed:${_types.FileFolder.FilesField}:file-1`);
    });
    it('returns null for a FILES image identifier when signUrl is not provided', async ()=>{
        const avatarFileField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'avatar-ui',
            objectMetadataId: 'person-id',
            id: 'avatar-id',
            name: 'avatarFile',
            type: _types.FieldMetadataType.FILES
        });
        const person = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'person-ui',
            id: 'person-id',
            nameSingular: 'person',
            imageIdentifierFieldMetadataId: 'avatar-id'
        });
        const result = await (0, _getrecordimageidentifierutil.getRecordImageIdentifier)({
            record: {
                avatarFile: [
                    {
                        fileId: 'file-1'
                    }
                ]
            },
            flatObjectMetadata: person,
            flatFieldMetadataMaps: buildFieldMaps([
                avatarFileField
            ]),
            allowRequestsToTwentyIcons: true
        });
        expect(result).toBe(null);
    });
    it('prefers the overrides column over the base image identifier', async ()=>{
        const baseTextField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'text-ui',
            objectMetadataId: 'custom-id',
            id: 'text-id',
            name: 'baseText',
            type: _types.FieldMetadataType.TEXT
        });
        const domainNameField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'domain-ui',
            objectMetadataId: 'custom-id',
            id: 'domain-id',
            name: 'domainName',
            type: _types.FieldMetadataType.LINKS
        });
        const customObject = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'custom-ui',
            id: 'custom-id',
            nameSingular: 'custom',
            imageIdentifierFieldMetadataId: 'text-id',
            overrides: {
                imageIdentifierFieldMetadataId: 'domain-id'
            }
        });
        const result = await (0, _getrecordimageidentifierutil.getRecordImageIdentifier)({
            record: {
                baseText: 'ignored',
                domainName: {
                    primaryLinkUrl: 'acme.com'
                }
            },
            flatObjectMetadata: customObject,
            flatFieldMetadataMaps: buildFieldMaps([
                baseTextField,
                domainNameField
            ]),
            allowRequestsToTwentyIcons: true
        });
        expect(result).toBe('https://twenty-icons.com/acme.com');
    });
    it('respects an explicit null override (cleared image identifier)', async ()=>{
        const domainNameField = (0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            universalIdentifier: 'domain-ui',
            objectMetadataId: 'custom-id',
            id: 'domain-id',
            name: 'domainName',
            type: _types.FieldMetadataType.LINKS
        });
        const customObject = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'custom-ui',
            id: 'custom-id',
            nameSingular: 'custom',
            imageIdentifierFieldMetadataId: 'domain-id',
            overrides: {
                imageIdentifierFieldMetadataId: null
            }
        });
        const result = await (0, _getrecordimageidentifierutil.getRecordImageIdentifier)({
            record: {
                domainName: {
                    primaryLinkUrl: 'acme.com'
                }
            },
            flatObjectMetadata: customObject,
            flatFieldMetadataMaps: buildFieldMaps([
                domainNameField
            ]),
            allowRequestsToTwentyIcons: true
        });
        expect(result).toBe(null);
    });
    it('returns null when the image identifier field cannot be resolved', async ()=>{
        const customObject = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'custom-ui',
            id: 'custom-id',
            nameSingular: 'custom',
            imageIdentifierFieldMetadataId: 'missing-id'
        });
        const result = await (0, _getrecordimageidentifierutil.getRecordImageIdentifier)({
            record: {},
            flatObjectMetadata: customObject,
            flatFieldMetadataMaps: buildFieldMaps([]),
            allowRequestsToTwentyIcons: true
        });
        expect(result).toBe(null);
    });
    it('signs the workspace member avatar url as a CorePicture (exception)', async ()=>{
        const fileId = '20202020-1c25-4d02-bf25-6aeccf7ea419';
        const workspaceMember = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            universalIdentifier: 'workspace-member-ui',
            id: 'workspace-member-id',
            nameSingular: 'workspaceMember'
        });
        const result = await (0, _getrecordimageidentifierutil.getRecordImageIdentifier)({
            record: {
                avatarUrl: `https://example.com/file/${_types.FileFolder.CorePicture}/${fileId}`
            },
            flatObjectMetadata: workspaceMember,
            flatFieldMetadataMaps: buildFieldMaps([]),
            allowRequestsToTwentyIcons: true,
            signUrl
        });
        expect(result).toBe(`signed:${_types.FileFolder.CorePicture}:${fileId}`);
    });
});

//# sourceMappingURL=get-record-image-identifier.util.spec.js.map