"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _relationtypeinterface = require("../../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _buildworkspacetableshapeutil = require("../build-workspace-table-shape.util");
const _twentystandardapplications = require("../../../../workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
const WORKSPACE_ID = '20202020-1c25-4d02-bf25-6aeccf7ea419';
const buildFlatFieldMetadata = (flatFieldMetadata)=>flatFieldMetadata;
const buildFlatFieldMetadataMaps = (flatFieldMetadatas)=>({
        universalIdentifierById: Object.fromEntries(flatFieldMetadatas.map((flatFieldMetadata)=>[
                flatFieldMetadata.id,
                flatFieldMetadata.id
            ])),
        byUniversalIdentifier: Object.fromEntries(flatFieldMetadatas.map((flatFieldMetadata)=>[
                flatFieldMetadata.id,
                flatFieldMetadata
            ]))
    });
describe('buildWorkspaceTableShape', ()=>{
    const flatFieldMetadatas = [
        buildFlatFieldMetadata({
            id: 'field-id',
            universalIdentifier: 'field-id',
            name: 'id',
            type: _types.FieldMetadataType.UUID
        }),
        buildFlatFieldMetadata({
            id: 'field-name',
            name: 'name',
            type: _types.FieldMetadataType.FULL_NAME
        }),
        buildFlatFieldMetadata({
            id: 'field-deletedAt',
            name: 'deletedAt',
            type: _types.FieldMetadataType.DATE_TIME
        }),
        buildFlatFieldMetadata({
            id: 'field-company',
            name: 'company',
            type: _types.FieldMetadataType.RELATION,
            settings: {
                relationType: _relationtypeinterface.RelationType.MANY_TO_ONE
            },
            relationTargetObjectMetadataId: 'company-object-id',
            relationTargetFieldMetadataId: 'field-people'
        }),
        buildFlatFieldMetadata({
            id: 'field-pets',
            name: 'pets',
            type: _types.FieldMetadataType.RELATION,
            settings: {
                relationType: _relationtypeinterface.RelationType.ONE_TO_MANY
            },
            relationTargetObjectMetadataId: 'pet-object-id',
            relationTargetFieldMetadataId: 'field-owner'
        })
    ];
    const flatObjectMetadata = {
        id: 'person-object-id',
        nameSingular: 'person',
        applicationUniversalIdentifier: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
        fieldIds: flatFieldMetadatas.map((flatFieldMetadata)=>flatFieldMetadata.id)
    };
    const tableShape = (0, _buildworkspacetableshapeutil.buildWorkspaceTableShape)({
        workspaceId: WORKSPACE_ID,
        flatObjectMetadata,
        flatFieldMetadataMaps: buildFlatFieldMetadataMaps(flatFieldMetadatas)
    });
    it('should qualify the table with the workspace schema', ()=>{
        expect(tableShape.schemaName).toMatch(/^workspace_/);
        expect(tableShape.tableName).toBe('person');
    });
    it('should prefix custom object tables with an underscore', ()=>{
        const customTableShape = (0, _buildworkspacetableshapeutil.buildWorkspaceTableShape)({
            workspaceId: WORKSPACE_ID,
            flatObjectMetadata: {
                ...flatObjectMetadata,
                applicationUniversalIdentifier: 'a-custom-application',
                nameSingular: 'rocket'
            },
            flatFieldMetadataMaps: buildFlatFieldMetadataMaps(flatFieldMetadatas)
        });
        expect(customTableShape.tableName).toBe('_rocket');
    });
    it('should expand a composite field into one column per property', ()=>{
        expect(tableShape.columnNames).toEqual(expect.arrayContaining([
            'nameFirstName',
            'nameLastName'
        ]));
        expect(tableShape.columnNames).not.toContain('name');
    });
    it('should record the parent field of every composite sub-column', ()=>{
        expect(tableShape.columnShapeByColumnName['nameFirstName'].compositeParentFieldName).toBe('name');
    });
    it('should give a to-one relation a foreign key column but a to-many none', ()=>{
        expect(tableShape.columnNames).toContain('companyId');
        expect(tableShape.columnNames).not.toContain('petsId');
        expect(tableShape.relationShapeByFieldName['company'].joinColumnName).toBe('companyId');
        expect(tableShape.relationShapeByFieldName['pets'].joinColumnName).toBeUndefined();
    });
    it('should detect the soft-delete column', ()=>{
        expect(tableShape.hasDeletedAtColumn).toBe(true);
    });
});

//# sourceMappingURL=build-workspace-table-shape.util.spec.js.map