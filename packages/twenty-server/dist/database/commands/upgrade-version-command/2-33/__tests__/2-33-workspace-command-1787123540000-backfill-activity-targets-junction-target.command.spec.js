"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _233workspacecommand1787123540000backfillactivitytargetsjunctiontargetcommand = require("../2-33-workspace-command-1787123540000-backfill-activity-targets-junction-target.command");
const _invalidatefieldmetadatacacheutil = require("../../utils/invalidate-field-metadata-cache.util");
jest.mock('src/database/commands/upgrade-version-command/utils/invalidate-field-metadata-cache.util');
const invalidateFieldMetadataCacheMock = jest.mocked(_invalidatefieldmetadatacacheutil.invalidateFieldMetadataCache);
const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';
const NOTE_TARGET_OBJECT_METADATA_ID = '20202020-0000-0000-0000-000000000002';
const TASK_TARGET_OBJECT_METADATA_ID = '20202020-0000-0000-0000-000000000003';
const NOTE_TARGETS_FIELD_METADATA_ID = '20202020-0000-0000-0000-000000000004';
const TASK_TARGETS_FIELD_METADATA_ID = '20202020-0000-0000-0000-000000000005';
const LEGACY_NOTE_TARGET_PERSON_FIELD_METADATA_ID = '20202020-0000-0000-0000-000000000006';
const LEGACY_TASK_TARGET_PERSON_FIELD_METADATA_ID = '20202020-0000-0000-0000-000000000007';
const LEGACY_NOTE_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER = '20202020-38ca-4aab-92f5-8a605ca2e4c5';
const LEGACY_TASK_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER = '20202020-c8a0-4e85-a016-87e2349cfbec';
const buildFlatFieldMetadata = (overrides)=>({
        id: '20202020-0000-0000-0000-000000000099',
        universalIdentifier: '20202020-0000-0000-0000-000000000098',
        type: _types.FieldMetadataType.TEXT,
        settings: null,
        ...overrides
    });
const buildFlatFieldMetadataMaps = (flatFieldMetadatas)=>({
        byUniversalIdentifier: Object.fromEntries(flatFieldMetadatas.map((flatFieldMetadata)=>[
                flatFieldMetadata.universalIdentifier,
                flatFieldMetadata
            ])),
        universalIdentifierById: Object.fromEntries(flatFieldMetadatas.map((flatFieldMetadata)=>[
                flatFieldMetadata.id,
                flatFieldMetadata.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const NOTE_TARGETS_FLAT_FIELD_METADATA = buildFlatFieldMetadata({
    id: NOTE_TARGETS_FIELD_METADATA_ID,
    universalIdentifier: _metadata.STANDARD_OBJECTS.note.fields.noteTargets.universalIdentifier,
    type: _types.FieldMetadataType.RELATION,
    relationTargetObjectMetadataId: NOTE_TARGET_OBJECT_METADATA_ID,
    settings: {
        relationType: _types.RelationType.ONE_TO_MANY
    }
});
const TASK_TARGETS_FLAT_FIELD_METADATA = buildFlatFieldMetadata({
    id: TASK_TARGETS_FIELD_METADATA_ID,
    universalIdentifier: _metadata.STANDARD_OBJECTS.task.fields.taskTargets.universalIdentifier,
    type: _types.FieldMetadataType.RELATION,
    relationTargetObjectMetadataId: TASK_TARGET_OBJECT_METADATA_ID,
    settings: {
        relationType: _types.RelationType.ONE_TO_MANY
    }
});
const LEGACY_NOTE_TARGET_PERSON_FLAT_FIELD_METADATA = buildFlatFieldMetadata({
    id: LEGACY_NOTE_TARGET_PERSON_FIELD_METADATA_ID,
    universalIdentifier: LEGACY_NOTE_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
    objectMetadataId: NOTE_TARGET_OBJECT_METADATA_ID,
    type: _types.FieldMetadataType.RELATION,
    settings: {
        relationType: _types.RelationType.MANY_TO_ONE
    }
});
const LEGACY_TASK_TARGET_PERSON_FLAT_FIELD_METADATA = buildFlatFieldMetadata({
    id: LEGACY_TASK_TARGET_PERSON_FIELD_METADATA_ID,
    universalIdentifier: LEGACY_TASK_TARGET_PERSON_FIELD_UNIVERSAL_IDENTIFIER,
    objectMetadataId: TASK_TARGET_OBJECT_METADATA_ID,
    type: _types.FieldMetadataType.RELATION,
    settings: {
        relationType: _types.RelationType.MANY_TO_ONE
    }
});
describe('BackfillActivityTargetsJunctionTargetCommand', ()=>{
    let command;
    let findOneMock;
    let updateMock;
    beforeEach(()=>{
        jest.clearAllMocks();
        findOneMock = jest.fn().mockResolvedValueOnce({
            settings: {
                relationType: _types.RelationType.ONE_TO_MANY
            }
        }).mockResolvedValueOnce({
            settings: {
                relationType: _types.RelationType.ONE_TO_MANY
            }
        });
        updateMock = jest.fn();
        const transactionalRepository = {
            findOne: findOneMock,
            update: updateMock
        };
        const fieldMetadataRepository = {
            manager: {
                transaction: jest.fn(async (callback)=>callback({
                        getRepository: ()=>transactionalRepository
                    }))
            }
        };
        command = new _233workspacecommand1787123540000backfillactivitytargetsjunctiontargetcommand.BackfillActivityTargetsJunctionTargetCommand({}, {
            getOrRecompute: jest.fn().mockResolvedValue({
                flatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                    NOTE_TARGETS_FLAT_FIELD_METADATA,
                    TASK_TARGETS_FLAT_FIELD_METADATA,
                    LEGACY_NOTE_TARGET_PERSON_FLAT_FIELD_METADATA,
                    LEGACY_TASK_TARGET_PERSON_FLAT_FIELD_METADATA
                ])
            })
        }, {}, fieldMetadataRepository);
    });
    it('backfills legacy note and task target person relation identifiers', async ()=>{
        await command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            options: {},
            index: 0,
            total: 1
        });
        expect(updateMock).toHaveBeenNthCalledWith(1, {
            id: NOTE_TARGETS_FIELD_METADATA_ID,
            workspaceId: WORKSPACE_ID
        }, {
            settings: {
                relationType: _types.RelationType.ONE_TO_MANY,
                junctionTargetFieldId: LEGACY_NOTE_TARGET_PERSON_FIELD_METADATA_ID
            }
        });
        expect(updateMock).toHaveBeenNthCalledWith(2, {
            id: TASK_TARGETS_FIELD_METADATA_ID,
            workspaceId: WORKSPACE_ID
        }, {
            settings: {
                relationType: _types.RelationType.ONE_TO_MANY,
                junctionTargetFieldId: LEGACY_TASK_TARGET_PERSON_FIELD_METADATA_ID
            }
        });
        expect(invalidateFieldMetadataCacheMock).toHaveBeenCalledWith({
            workspaceId: WORKSPACE_ID,
            workspaceMigrationRunnerService: expect.anything()
        });
    });
});

//# sourceMappingURL=2-33-workspace-command-1787123540000-backfill-activity-targets-junction-target.command.spec.js.map