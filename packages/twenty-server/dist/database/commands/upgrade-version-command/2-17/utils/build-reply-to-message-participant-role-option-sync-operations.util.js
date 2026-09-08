"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get REPLY_TO_MESSAGE_PARTICIPANT_ROLE_OPTION () {
        return REPLY_TO_MESSAGE_PARTICIPANT_ROLE_OPTION;
    },
    get buildReplyToMessageParticipantRoleOptionSyncOperations () {
        return buildReplyToMessageParticipantRoleOptionSyncOperations;
    }
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const MESSAGE_PARTICIPANT_ROLE_FIELD_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.messageParticipant.fields.role.universalIdentifier;
const REPLY_TO_MESSAGE_PARTICIPANT_ROLE_OPTION = {
    id: '20202020-3b1a-4e2c-9d7f-8a6b5c4d3e2f',
    value: _types.MessageParticipantRole.REPLY_TO,
    label: 'Reply To',
    position: 4,
    color: 'purple'
};
const buildReplyToMessageParticipantRoleOptionSyncOperations = ({ existingFlatFieldMetadataMaps, now })=>{
    const roleField = existingFlatFieldMetadataMaps.byUniversalIdentifier[MESSAGE_PARTICIPANT_ROLE_FIELD_UNIVERSAL_IDENTIFIER];
    const existingOptions = roleField?.options ?? [];
    const replyToOptionIsMissing = roleField?.type === _types.FieldMetadataType.SELECT && !existingOptions.some((option)=>option.id === REPLY_TO_MESSAGE_PARTICIPANT_ROLE_OPTION.id);
    if (!replyToOptionIsMissing) {
        return {
            flatEntityToCreate: [],
            flatEntityToDelete: [],
            flatEntityToUpdate: []
        };
    }
    return {
        flatEntityToCreate: [],
        flatEntityToDelete: [],
        flatEntityToUpdate: [
            {
                ...roleField,
                options: [
                    ...existingOptions,
                    REPLY_TO_MESSAGE_PARTICIPANT_ROLE_OPTION
                ],
                updatedAt: now
            }
        ]
    };
};

//# sourceMappingURL=build-reply-to-message-participant-role-option-sync-operations.util.js.map