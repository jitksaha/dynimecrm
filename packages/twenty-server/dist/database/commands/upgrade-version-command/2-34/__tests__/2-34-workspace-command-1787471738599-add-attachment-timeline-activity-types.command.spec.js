"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _234workspacecommand1787471738599addattachmenttimelineactivitytypescommand = require("../2-34-workspace-command-1787471738599-add-attachment-timeline-activity-types.command");
const WORKSPACE_ID = '00000000-0000-4000-8000-000000000001';
const STANDARD_APPLICATION_ID = '00000000-0000-4000-8000-000000000002';
const ATTACHMENT_OBJECT_ID = '00000000-0000-4000-8000-000000000003';
const ATTACHMENT_TARGET_MORPH_ID = '20202020-f634-435d-ab8d-e1168b375c69';
const ATTACHMENT_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER = '721ddb1f-468d-535a-9809-cb3429a52e06';
const LINKED_TYPE_UNIVERSAL_IDENTIFIER = '20202020-0d1a-4f0e-8a55-1c0a2f0a2c11';
const UNLINKED_TYPE_UNIVERSAL_IDENTIFIER = '20202020-0d1a-4f0e-8a55-1c0a2f0a2c12';
const buildCommand = ({ flatTimelineActivityTypes = {}, attachmentTargetFields = {
    [ATTACHMENT_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER]: {
        id: '00000000-0000-4000-8000-000000000004',
        objectMetadataId: ATTACHMENT_OBJECT_ID,
        type: 'MORPH_RELATION',
        morphId: ATTACHMENT_TARGET_MORPH_ID,
        universalIdentifier: ATTACHMENT_TARGET_RELATION_FIELD_UNIVERSAL_IDENTIFIER
    }
}, hasTimelineActivity = true, migrationResult = {
    status: 'success'
} })=>{
    const validateBuildAndRunWorkspaceMigration = jest.fn().mockResolvedValue(migrationResult);
    const findStandardApplication = jest.fn().mockResolvedValue({
        twentyStandardFlatApplication: {
            id: STANDARD_APPLICATION_ID
        }
    });
    const command = new _234workspacecommand1787471738599addattachmenttimelineactivitytypescommand.AddAttachmentTimelineActivityTypesCommand({}, {
        findWorkspaceTwentyStandardAndCustomApplicationOrThrow: findStandardApplication
    }, {
        getOrRecompute: jest.fn().mockResolvedValue({
            flatFieldMetadataMaps: {
                byUniversalIdentifier: attachmentTargetFields
            },
            flatObjectMetadataMaps: {
                byUniversalIdentifier: hasTimelineActivity ? {
                    [_metadata.STANDARD_OBJECTS.timelineActivity.universalIdentifier]: {},
                    [_metadata.STANDARD_OBJECTS.attachment.universalIdentifier]: {
                        id: ATTACHMENT_OBJECT_ID
                    }
                } : {}
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
        findStandardApplication,
        validateBuildAndRunWorkspaceMigration
    };
};
const runCommand = (command)=>command.runOnWorkspace({
        workspaceId: WORKSPACE_ID,
        options: {},
        index: 0,
        total: 1
    });
describe('AddAttachmentTimelineActivityTypesCommand', ()=>{
    it('creates both frozen attachment activity definitions', async ()=>{
        const { command, validateBuildAndRunWorkspaceMigration } = buildCommand({});
        await runCommand(command);
        const operation = validateBuildAndRunWorkspaceMigration.mock.calls[0][0].allFlatEntityOperationByMetadataName.timelineActivityType;
        expect(operation.flatEntityToCreate).toEqual([
            expect.objectContaining({
                universalIdentifier: LINKED_TYPE_UNIVERSAL_IDENTIFIER,
                action: 'linked',
                name: 'attachmentLinked',
                objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.attachment.universalIdentifier,
                targetRelationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.attachment.fields.targetPerson.universalIdentifier
            }),
            expect.objectContaining({
                universalIdentifier: UNLINKED_TYPE_UNIVERSAL_IDENTIFIER,
                action: 'unlinked',
                name: 'attachmentUnlinked'
            })
        ]);
    });
    it('only creates a missing definition when an upgrade resumes', async ()=>{
        const { command, validateBuildAndRunWorkspaceMigration } = buildCommand({
            flatTimelineActivityTypes: {
                [LINKED_TYPE_UNIVERSAL_IDENTIFIER]: {}
            }
        });
        await runCommand(command);
        const createdTypes = validateBuildAndRunWorkspaceMigration.mock.calls[0][0].allFlatEntityOperationByMetadataName.timelineActivityType.flatEntityToCreate;
        expect(createdTypes).toHaveLength(1);
        expect(createdTypes[0].universalIdentifier).toBe(UNLINKED_TYPE_UNIVERSAL_IDENTIFIER);
    });
    it('uses another member when the preferred attachment morph field is missing', async ()=>{
        const alternativeFieldUniversalIdentifier = '00000000-0000-4000-8000-000000000005';
        const { command, validateBuildAndRunWorkspaceMigration } = buildCommand({
            attachmentTargetFields: {
                [alternativeFieldUniversalIdentifier]: {
                    id: '00000000-0000-4000-8000-000000000006',
                    objectMetadataId: ATTACHMENT_OBJECT_ID,
                    type: 'MORPH_RELATION',
                    morphId: ATTACHMENT_TARGET_MORPH_ID,
                    universalIdentifier: alternativeFieldUniversalIdentifier
                }
            }
        });
        await runCommand(command);
        const createdTypes = validateBuildAndRunWorkspaceMigration.mock.calls[0][0].allFlatEntityOperationByMetadataName.timelineActivityType.flatEntityToCreate;
        expect(createdTypes).toEqual([
            expect.objectContaining({
                targetRelationFieldUniversalIdentifier: alternativeFieldUniversalIdentifier
            }),
            expect.objectContaining({
                targetRelationFieldUniversalIdentifier: alternativeFieldUniversalIdentifier
            })
        ]);
    });
    it('skips workspaces that only have legacy attachment relations', async ()=>{
        const { command, findStandardApplication, validateBuildAndRunWorkspaceMigration } = buildCommand({
            attachmentTargetFields: {
                '00000000-0000-4000-8000-000000000007': {
                    id: '00000000-0000-4000-8000-000000000007',
                    objectMetadataId: ATTACHMENT_OBJECT_ID,
                    type: 'RELATION',
                    morphId: null,
                    universalIdentifier: '00000000-0000-4000-8000-000000000007'
                }
            }
        });
        await runCommand(command);
        expect(findStandardApplication).not.toHaveBeenCalled();
        expect(validateBuildAndRunWorkspaceMigration).not.toHaveBeenCalled();
    });
    it('does nothing when standard sync already created both definitions', async ()=>{
        const { command, findStandardApplication, validateBuildAndRunWorkspaceMigration } = buildCommand({
            flatTimelineActivityTypes: {
                [LINKED_TYPE_UNIVERSAL_IDENTIFIER]: {},
                [UNLINKED_TYPE_UNIVERSAL_IDENTIFIER]: {}
            }
        });
        await runCommand(command);
        expect(findStandardApplication).not.toHaveBeenCalled();
        expect(validateBuildAndRunWorkspaceMigration).not.toHaveBeenCalled();
    });
    it('skips workspaces that predate timeline metadata', async ()=>{
        const { command, findStandardApplication, validateBuildAndRunWorkspaceMigration } = buildCommand({
            hasTimelineActivity: false
        });
        await runCommand(command);
        expect(findStandardApplication).not.toHaveBeenCalled();
        expect(validateBuildAndRunWorkspaceMigration).not.toHaveBeenCalled();
    });
    it('fails the upgrade when metadata creation fails', async ()=>{
        const { command } = buildCommand({
            migrationResult: {
                status: 'fail'
            }
        });
        await expect(runCommand(command)).rejects.toThrow('Failed to add attachment timeline activity types');
    });
});

//# sourceMappingURL=2-34-workspace-command-1787471738599-add-attachment-timeline-activity-types.command.spec.js.map