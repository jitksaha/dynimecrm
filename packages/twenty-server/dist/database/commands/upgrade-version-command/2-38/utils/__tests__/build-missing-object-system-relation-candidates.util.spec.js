"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _buildmissingobjectsystemrelationcandidatesutil = require("../build-missing-object-system-relation-candidates.util");
const _createemptyflatentitymapsconstant = require("../../../../../../engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../../../../engine/metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _getflatfieldmetadatamock = require("../../../../../../engine/metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const _getflatobjectmetadatamock = require("../../../../../../engine/metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const STANDARD_APP_UID = '20202020-0000-4000-8000-000000000001';
const CUSTOM_APP_UID = '20202020-0000-4000-8000-000000000002';
const HOLDER_NAME_PLURALS = {
    timelineActivity: 'timelineActivities',
    attachment: 'attachments',
    noteTarget: 'noteTargets',
    taskTarget: 'taskTargets'
};
const buildArgs = ({ sources, holderExtraFieldNames = {}, columnNamesByHolder = {}, detachedFields = [] })=>{
    const flatObjectMetadatas = [];
    const flatFieldMetadatas = [];
    const holderFieldIds = {
        timelineActivity: [],
        attachment: [],
        noteTarget: [],
        taskTarget: []
    };
    const registerField = ({ fieldId, objectMetadataId, name, type = _types.FieldMetadataType.TEXT, morphId, relationTargetObjectMetadataId, universalIdentifier })=>{
        flatFieldMetadatas.push((0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
            id: fieldId,
            universalIdentifier: universalIdentifier ?? `uid-${fieldId}`,
            objectMetadataId,
            name,
            type,
            morphId: morphId ?? null,
            relationTargetObjectMetadataId
        }));
    };
    for (const holderNameSingular of _metadata.DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS){
        for (const name of holderExtraFieldNames[holderNameSingular] ?? []){
            const fieldId = `field-${holderNameSingular}-${name}`;
            holderFieldIds[holderNameSingular].push(fieldId);
            registerField({
                fieldId,
                objectMetadataId: `object-${holderNameSingular}`,
                name
            });
        }
    }
    for (const source of sources){
        const sourceFieldIds = [];
        for (const holderNameSingular of [
            ...source.pairedHolders ?? [],
            ...source.reverseOnlyHolders ?? []
        ]){
            const fieldId = `field-${holderNameSingular}-target-${source.key}`;
            holderFieldIds[holderNameSingular].push(fieldId);
            registerField({
                fieldId,
                objectMetadataId: `object-${holderNameSingular}`,
                name: `target${source.nameSingular[0].toUpperCase()}${source.nameSingular.slice(1)}`,
                type: _types.FieldMetadataType.MORPH_RELATION,
                morphId: _metadata.STANDARD_OBJECTS[holderNameSingular].morphIds.targetMorphId.morphId,
                relationTargetObjectMetadataId: `object-${source.key}`
            });
        }
        for (const holderNameSingular of [
            ...source.pairedHolders ?? [],
            ...source.forwardOnlyHolders ?? []
        ]){
            const fieldId = `field-${source.key}-${holderNameSingular}`;
            sourceFieldIds.push(fieldId);
            registerField({
                fieldId,
                objectMetadataId: `object-${source.key}`,
                name: HOLDER_NAME_PLURALS[holderNameSingular],
                type: _types.FieldMetadataType.RELATION,
                relationTargetObjectMetadataId: `object-${holderNameSingular}`
            });
        }
        for (const name of source.extraFieldNames ?? []){
            const fieldId = `field-${source.key}-${name}`;
            sourceFieldIds.push(fieldId);
            registerField({
                fieldId,
                objectMetadataId: `object-${source.key}`,
                name
            });
        }
        for (const { name, holderNameSingular } of source.extraRelationFields ?? []){
            const fieldId = `field-${source.key}-${name}`;
            sourceFieldIds.push(fieldId);
            registerField({
                fieldId,
                objectMetadataId: `object-${source.key}`,
                name,
                type: _types.FieldMetadataType.RELATION,
                relationTargetObjectMetadataId: `object-${holderNameSingular}`
            });
        }
        flatObjectMetadatas.push((0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            id: `object-${source.key}`,
            universalIdentifier: `object-uid-${source.key}`,
            applicationUniversalIdentifier: source.applicationUniversalIdentifier ?? CUSTOM_APP_UID,
            nameSingular: source.nameSingular,
            namePlural: `${source.nameSingular}s`,
            isActive: source.isActive ?? true,
            fieldIds: sourceFieldIds
        }));
    }
    detachedFields.forEach(registerField);
    const holderFlatObjectMetadataByNameSingular = {};
    for (const holderNameSingular of _metadata.DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS){
        const holderFlatObjectMetadata = (0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
            id: `object-${holderNameSingular}`,
            universalIdentifier: _metadata.STANDARD_OBJECTS[holderNameSingular].universalIdentifier,
            applicationUniversalIdentifier: STANDARD_APP_UID,
            nameSingular: holderNameSingular,
            namePlural: HOLDER_NAME_PLURALS[holderNameSingular],
            fieldIds: holderFieldIds[holderNameSingular]
        });
        flatObjectMetadatas.push(holderFlatObjectMetadata);
        holderFlatObjectMetadataByNameSingular[holderNameSingular] = holderFlatObjectMetadata;
    }
    return {
        flatObjectMetadataMaps: flatObjectMetadatas.reduce((flatEntityMaps, flatEntity)=>(0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
                flatEntity,
                flatEntityMaps
            }), (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()),
        flatFieldMetadataMaps: flatFieldMetadatas.reduce((flatEntityMaps, flatEntity)=>(0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
                flatEntity,
                flatEntityMaps
            }), (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()),
        holderFlatObjectMetadataByNameSingular,
        existingColumnNamesByHolderNameSingular: {
            timelineActivity: new Set(columnNamesByHolder.timelineActivity ?? []),
            attachment: new Set(columnNamesByHolder.attachment ?? []),
            noteTarget: new Set(columnNamesByHolder.noteTarget ?? []),
            taskTarget: new Set(columnNamesByHolder.taskTarget ?? [])
        },
        twentyStandardApplicationUniversalIdentifier: STANDARD_APP_UID
    };
};
describe('buildMissingObjectSystemRelationCandidates', ()=>{
    it('provisions all four pairs for an object that has none', ()=>{
        const result = (0, _buildmissingobjectsystemrelationcandidatesutil.buildMissingObjectSystemRelationCandidates)(buildArgs({
            sources: [
                {
                    key: 'phone',
                    nameSingular: 'phoneNumber2'
                }
            ]
        }));
        expect(result.unprovisionableSystemRelations).toEqual([]);
        expect(result.candidates).toHaveLength(1);
        expect(result.candidates[0].sourceFlatObjectMetadata.nameSingular).toBe('phoneNumber2');
        expect(result.candidates[0].missingHolderNameSingulars).toEqual([
            'timelineActivity',
            'attachment',
            'noteTarget',
            'taskTarget'
        ]);
    });
    it('skips objects owned by twenty-standard', ()=>{
        const result = (0, _buildmissingobjectsystemrelationcandidatesutil.buildMissingObjectSystemRelationCandidates)(buildArgs({
            sources: [
                {
                    key: 'company',
                    nameSingular: 'company',
                    applicationUniversalIdentifier: STANDARD_APP_UID
                }
            ]
        }));
        expect(result.candidates).toEqual([]);
        expect(result.unprovisionableSystemRelations).toEqual([]);
    });
    it('skips pairs where both legs already exist', ()=>{
        const result = (0, _buildmissingobjectsystemrelationcandidatesutil.buildMissingObjectSystemRelationCandidates)(buildArgs({
            sources: [
                {
                    key: 'deal',
                    nameSingular: 'deal',
                    pairedHolders: [
                        ..._metadata.DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS
                    ]
                }
            ]
        }));
        expect(result.candidates).toEqual([]);
        expect(result.unprovisionableSystemRelations).toEqual([]);
    });
    it('reports a partial pair instead of completing it', ()=>{
        const result = (0, _buildmissingobjectsystemrelationcandidatesutil.buildMissingObjectSystemRelationCandidates)(buildArgs({
            sources: [
                {
                    key: 'deal',
                    nameSingular: 'deal',
                    reverseOnlyHolders: [
                        'timelineActivity'
                    ],
                    forwardOnlyHolders: [
                        'attachment'
                    ]
                }
            ]
        }));
        expect(result.unprovisionableSystemRelations).toEqual([
            {
                sourceObjectNameSingular: 'deal',
                holderNameSingular: 'timelineActivity',
                reason: expect.stringContaining('reverse morph')
            },
            {
                sourceObjectNameSingular: 'deal',
                holderNameSingular: 'attachment',
                reason: expect.stringContaining('forward relation')
            }
        ]);
        expect(result.candidates[0].missingHolderNameSingulars).toEqual([
            'noteTarget',
            'taskTarget'
        ]);
    });
    it('provisions pairs for an inactive object like creation would have', ()=>{
        const result = (0, _buildmissingobjectsystemrelationcandidatesutil.buildMissingObjectSystemRelationCandidates)(buildArgs({
            sources: [
                {
                    key: 'archived',
                    nameSingular: 'estateLeadArchived',
                    isActive: false
                }
            ]
        }));
        expect(result.unprovisionableSystemRelations).toEqual([]);
        expect(result.candidates[0].missingHolderNameSingulars).toEqual([
            'timelineActivity',
            'attachment',
            'noteTarget',
            'taskTarget'
        ]);
    });
    it('does not let an unrelated relation to a holder mask a missing pair', ()=>{
        const result = (0, _buildmissingobjectsystemrelationcandidatesutil.buildMissingObjectSystemRelationCandidates)(buildArgs({
            sources: [
                {
                    key: 'phone',
                    nameSingular: 'phoneNumber2',
                    extraRelationFields: [
                        {
                            name: 'myAttachmentLink',
                            holderNameSingular: 'attachment'
                        }
                    ]
                }
            ]
        }));
        expect(result.unprovisionableSystemRelations).toEqual([]);
        expect(result.candidates[0].missingHolderNameSingulars).toEqual([
            'timelineActivity',
            'attachment',
            'noteTarget',
            'taskTarget'
        ]);
    });
    it('reports a reverse field name already taken on the holder', ()=>{
        const result = (0, _buildmissingobjectsystemrelationcandidatesutil.buildMissingObjectSystemRelationCandidates)(buildArgs({
            sources: [
                {
                    key: 'phone',
                    nameSingular: 'phoneNumber2'
                }
            ],
            holderExtraFieldNames: {
                timelineActivity: [
                    'targetPhoneNumber2'
                ]
            }
        }));
        expect(result.unprovisionableSystemRelations).toEqual([
            {
                sourceObjectNameSingular: 'phoneNumber2',
                holderNameSingular: 'timelineActivity',
                reason: expect.stringContaining('already exists on timelineActivity')
            }
        ]);
        expect(result.candidates[0].missingHolderNameSingulars).toEqual([
            'attachment',
            'noteTarget',
            'taskTarget'
        ]);
    });
    it('reports a forward field name already taken on the source', ()=>{
        const result = (0, _buildmissingobjectsystemrelationcandidatesutil.buildMissingObjectSystemRelationCandidates)(buildArgs({
            sources: [
                {
                    key: 'phone',
                    nameSingular: 'phoneNumber2',
                    extraFieldNames: [
                        'attachments'
                    ]
                }
            ]
        }));
        expect(result.unprovisionableSystemRelations).toEqual([
            {
                sourceObjectNameSingular: 'phoneNumber2',
                holderNameSingular: 'attachment',
                reason: expect.stringContaining('already exists on phoneNumber2')
            }
        ]);
        expect(result.candidates[0].missingHolderNameSingulars).toEqual([
            'timelineActivity',
            'noteTarget',
            'taskTarget'
        ]);
    });
    it('reports a surviving physical join column', ()=>{
        const result = (0, _buildmissingobjectsystemrelationcandidatesutil.buildMissingObjectSystemRelationCandidates)(buildArgs({
            sources: [
                {
                    key: 'phone',
                    nameSingular: 'phoneNumber2'
                }
            ],
            columnNamesByHolder: {
                timelineActivity: [
                    'targetPhoneNumber2Id'
                ]
            }
        }));
        expect(result.unprovisionableSystemRelations).toEqual([
            {
                sourceObjectNameSingular: 'phoneNumber2',
                holderNameSingular: 'timelineActivity',
                reason: expect.stringContaining('column "targetPhoneNumber2Id" already exists')
            }
        ]);
        expect(result.candidates[0].missingHolderNameSingulars).toEqual([
            'attachment',
            'noteTarget',
            'taskTarget'
        ]);
    });
    it('counts a leg held by its deterministic identifier even without matching relation semantics', ()=>{
        const result = (0, _buildmissingobjectsystemrelationcandidatesutil.buildMissingObjectSystemRelationCandidates)(buildArgs({
            sources: [
                {
                    key: 'phone',
                    nameSingular: 'phoneNumber2'
                }
            ],
            detachedFields: [
                {
                    fieldId: 'field-detached',
                    objectMetadataId: 'object-detached',
                    name: 'unrelated',
                    universalIdentifier: (0, _application.getSystemRelationFieldUniversalIdentifier)({
                        applicationUniversalIdentifier: CUSTOM_APP_UID,
                        objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.timelineActivity.universalIdentifier,
                        relationTargetObjectUniversalIdentifier: 'object-uid-phone'
                    })
                }
            ]
        }));
        expect(result.unprovisionableSystemRelations).toEqual([
            {
                sourceObjectNameSingular: 'phoneNumber2',
                holderNameSingular: 'timelineActivity',
                reason: expect.stringContaining('partial pair')
            }
        ]);
        expect(result.candidates[0].missingHolderNameSingulars).toEqual([
            'attachment',
            'noteTarget',
            'taskTarget'
        ]);
    });
});

//# sourceMappingURL=build-missing-object-system-relation-candidates.util.spec.js.map