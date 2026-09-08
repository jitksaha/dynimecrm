"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _235workspacecommand1787561579075repairattachmenttimelineactivitytypescommand = require("../2-35-workspace-command-1787561579075-repair-attachment-timeline-activity-types.command");
const WORKSPACE_ID = '00000000-0000-4000-8000-000000000001';
const STANDARD_APPLICATION_ID = '00000000-0000-4000-8000-000000000002';
const CUSTOM_APPLICATION_ID = '00000000-0000-4000-8000-000000000003';
const ATTACHMENT_OBJECT_ID = '00000000-0000-4000-8000-000000000004';
const RELATION_TARGET_OBJECT_ID = '00000000-0000-4000-8000-000000000005';
const RELATION_TARGET_FIELD_ID = '00000000-0000-4000-8000-000000000006';
const ATTACHMENT_TARGET_MORPH_ID = '20202020-f634-435d-ab8d-e1168b375c69';
const PREFERRED_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER = '721ddb1f-468d-535a-9809-cb3429a52e06';
const LINKED_TYPE_UNIVERSAL_IDENTIFIER = '20202020-0d1a-4f0e-8a55-1c0a2f0a2c11';
const UNLINKED_TYPE_UNIVERSAL_IDENTIFIER = '20202020-0d1a-4f0e-8a55-1c0a2f0a2c12';
const buildTargetField = ({ universalIdentifier })=>({
        id: universalIdentifier,
        applicationId: CUSTOM_APPLICATION_ID,
        objectMetadataId: ATTACHMENT_OBJECT_ID,
        relationTargetObjectMetadataId: RELATION_TARGET_OBJECT_ID,
        relationTargetFieldMetadataId: RELATION_TARGET_FIELD_ID,
        type: _types.FieldMetadataType.MORPH_RELATION,
        morphId: ATTACHMENT_TARGET_MORPH_ID,
        settings: {
            relationType: _types.RelationType.MANY_TO_ONE
        },
        universalIdentifier
    });
const buildCommand = ({ attachmentTargetFields = {
    [PREFERRED_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER]: buildTargetField({
        universalIdentifier: PREFERRED_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER
    })
}, flatTimelineActivityTypes = {}, migrationResult = {
    status: 'success'
} })=>{
    const validateBuildAndRunWorkspaceMigration = jest.fn().mockResolvedValue(migrationResult);
    const command = new _235workspacecommand1787561579075repairattachmenttimelineactivitytypescommand.RepairAttachmentTimelineActivityTypesCommand({}, {
        findWorkspaceTwentyStandardAndCustomApplicationOrThrow: jest.fn().mockResolvedValue({
            twentyStandardFlatApplication: {
                id: STANDARD_APPLICATION_ID
            }
        })
    }, {
        getOrRecompute: jest.fn().mockResolvedValue({
            flatFieldMetadataMaps: {
                byUniversalIdentifier: attachmentTargetFields
            },
            flatObjectMetadataMaps: {
                byUniversalIdentifier: {
                    [_metadata.STANDARD_OBJECTS.timelineActivity.universalIdentifier]: {},
                    [_metadata.STANDARD_OBJECTS.attachment.universalIdentifier]: {
                        id: ATTACHMENT_OBJECT_ID
                    }
                }
            },
            flatTimelineActivityTypeMaps: {
                byUniversalIdentifier: flatTimelineActivityTypes
            }
        })
    }, {
        validateBuildAndRunWorkspaceMigration
    });
    return {
        command,
        validateBuildAndRunWorkspaceMigration
    };
};
const runCommand = (command, dryRun = false)=>command.runOnWorkspace({
        workspaceId: WORKSPACE_ID,
        options: {
            dryRun
        },
        index: 0,
        total: 1
    });
describe('RepairAttachmentTimelineActivityTypesCommand', ()=>{
    it('creates both missing definitions through the preferred target field', async ()=>{
        const { command, validateBuildAndRunWorkspaceMigration } = buildCommand({});
        await runCommand(command);
        const createdTypes = validateBuildAndRunWorkspaceMigration.mock.calls[0][0].allFlatEntityOperationByMetadataName.timelineActivityType.flatEntityToCreate;
        expect(createdTypes).toEqual([
            expect.objectContaining({
                universalIdentifier: LINKED_TYPE_UNIVERSAL_IDENTIFIER,
                action: 'linked',
                targetRelationFieldUniversalIdentifier: PREFERRED_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER
            }),
            expect.objectContaining({
                universalIdentifier: UNLINKED_TYPE_UNIVERSAL_IDENTIFIER,
                action: 'unlinked',
                targetRelationFieldUniversalIdentifier: PREFERRED_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER
            })
        ]);
    });
    it('uses a deterministic custom morph member when no standard member exists', async ()=>{
        const firstCustomTarget = '10000000-0000-4000-8000-000000000001';
        const secondCustomTarget = '20000000-0000-4000-8000-000000000002';
        const { command, validateBuildAndRunWorkspaceMigration } = buildCommand({
            attachmentTargetFields: {
                [secondCustomTarget]: buildTargetField({
                    universalIdentifier: secondCustomTarget
                }),
                [firstCustomTarget]: buildTargetField({
                    universalIdentifier: firstCustomTarget
                })
            }
        });
        await runCommand(command);
        const createdTypes = validateBuildAndRunWorkspaceMigration.mock.calls[0][0].allFlatEntityOperationByMetadataName.timelineActivityType.flatEntityToCreate;
        expect(createdTypes).toEqual([
            expect.objectContaining({
                targetRelationFieldUniversalIdentifier: firstCustomTarget
            }),
            expect.objectContaining({
                targetRelationFieldUniversalIdentifier: firstCustomTarget
            })
        ]);
    });
    it('only creates missing definitions and preserves muted definitions', async ()=>{
        const { command, validateBuildAndRunWorkspaceMigration } = buildCommand({
            flatTimelineActivityTypes: {
                [LINKED_TYPE_UNIVERSAL_IDENTIFIER]: {
                    isActive: false
                }
            }
        });
        await runCommand(command);
        const createdTypes = validateBuildAndRunWorkspaceMigration.mock.calls[0][0].allFlatEntityOperationByMetadataName.timelineActivityType.flatEntityToCreate;
        expect(createdTypes).toHaveLength(1);
        expect(createdTypes[0]).toEqual(expect.objectContaining({
            universalIdentifier: UNLINKED_TYPE_UNIVERSAL_IDENTIFIER
        }));
    });
    it('skips invalid attachment morph members', async ()=>{
        const invalidFieldUniversalIdentifier = '30000000-0000-4000-8000-000000000003';
        const { command, validateBuildAndRunWorkspaceMigration } = buildCommand({
            attachmentTargetFields: {
                [invalidFieldUniversalIdentifier]: {
                    ...buildTargetField({
                        universalIdentifier: invalidFieldUniversalIdentifier
                    }),
                    relationTargetFieldMetadataId: null
                }
            }
        });
        await runCommand(command);
        expect(validateBuildAndRunWorkspaceMigration).not.toHaveBeenCalled();
    });
    it('does not mutate metadata during a dry run', async ()=>{
        const { command, validateBuildAndRunWorkspaceMigration } = buildCommand({});
        await runCommand(command, true);
        expect(validateBuildAndRunWorkspaceMigration).not.toHaveBeenCalled();
    });
    it('fails when the repair migration is rejected', async ()=>{
        const { command } = buildCommand({
            migrationResult: {
                status: 'fail'
            }
        });
        await expect(runCommand(command)).rejects.toThrow('Failed to repair attachment timeline activity types');
    });
});

//# sourceMappingURL=2-35-workspace-command-1787561579075-repair-attachment-timeline-activity-types.command.spec.js.map