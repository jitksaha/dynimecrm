"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _buildreplytomessageparticipantroleoptionsyncoperationsutil = require("../build-reply-to-message-participant-role-option-sync-operations.util");
const _getflatfieldmetadatamock = require("../../../../../../engine/metadata-modules/flat-field-metadata/__mocks__/get-flat-field-metadata.mock");
const ROLE_FIELD_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.messageParticipant.fields.role.universalIdentifier;
const NOW = '2026-06-26T00:00:00.000Z';
const buildRoleOption = (value, position)=>({
        id: `option-${value}`,
        value,
        label: value,
        position,
        color: 'gray'
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
const buildRoleField = (options)=>(0, _getflatfieldmetadatamock.getFlatFieldMetadataMock)({
        universalIdentifier: ROLE_FIELD_UNIVERSAL_IDENTIFIER,
        objectMetadataId: 'message-participant-object-id',
        type: _types.FieldMetadataType.SELECT,
        options
    });
describe('buildReplyToMessageParticipantRoleOptionSyncOperations', ()=>{
    it('appends the Reply To option to the existing role options without touching them', ()=>{
        const roleField = buildRoleField([
            buildRoleOption(_types.MessageParticipantRole.FROM, 0),
            buildRoleOption(_types.MessageParticipantRole.TO, 1),
            buildRoleOption(_types.MessageParticipantRole.CC, 2),
            buildRoleOption(_types.MessageParticipantRole.BCC, 3)
        ]);
        const { flatEntityToUpdate } = (0, _buildreplytomessageparticipantroleoptionsyncoperationsutil.buildReplyToMessageParticipantRoleOptionSyncOperations)({
            existingFlatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                roleField
            ]),
            now: NOW
        });
        expect(flatEntityToUpdate).toHaveLength(1);
        expect(flatEntityToUpdate[0]).toMatchObject({
            universalIdentifier: ROLE_FIELD_UNIVERSAL_IDENTIFIER,
            updatedAt: NOW,
            options: [
                ...roleField.options,
                _buildreplytomessageparticipantroleoptionsyncoperationsutil.REPLY_TO_MESSAGE_PARTICIPANT_ROLE_OPTION
            ]
        });
    });
    it('does nothing when the Reply To option is already present so the upgrade can be re-run safely', ()=>{
        const roleField = buildRoleField([
            buildRoleOption(_types.MessageParticipantRole.FROM, 0),
            _buildreplytomessageparticipantroleoptionsyncoperationsutil.REPLY_TO_MESSAGE_PARTICIPANT_ROLE_OPTION
        ]);
        const { flatEntityToUpdate } = (0, _buildreplytomessageparticipantroleoptionsyncoperationsutil.buildReplyToMessageParticipantRoleOptionSyncOperations)({
            existingFlatFieldMetadataMaps: buildFlatFieldMetadataMaps([
                roleField
            ]),
            now: NOW
        });
        expect(flatEntityToUpdate).toHaveLength(0);
    });
    it('does nothing when the workspace has no messageParticipant role field', ()=>{
        const { flatEntityToUpdate } = (0, _buildreplytomessageparticipantroleoptionsyncoperationsutil.buildReplyToMessageParticipantRoleOptionSyncOperations)({
            existingFlatFieldMetadataMaps: buildFlatFieldMetadataMaps([]),
            now: NOW
        });
        expect(flatEntityToUpdate).toHaveLength(0);
    });
});

//# sourceMappingURL=build-reply-to-message-participant-role-option-sync-operations.util.spec.js.map