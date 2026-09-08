"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMessageFolderAssociationsToInsert", {
    enumerable: true,
    get: function() {
        return buildMessageFolderAssociationsToInsert;
    }
});
const buildKey = ({ messageChannelMessageAssociationId, messageFolderId })=>`${messageChannelMessageAssociationId}:${messageFolderId}`;
const buildMessageFolderAssociationsToInsert = ({ associations, existingRecords })=>{
    const keysToSkip = new Set(existingRecords.map(buildKey));
    const recordsToInsert = [];
    for (const association of associations){
        for (const messageFolderId of association.messageFolderIds){
            const record = {
                messageChannelMessageAssociationId: association.messageChannelMessageAssociationId,
                messageFolderId
            };
            const key = buildKey(record);
            if (keysToSkip.has(key)) {
                continue;
            }
            keysToSkip.add(key);
            recordsToInsert.push(record);
        }
    }
    return recordsToInsert;
};

//# sourceMappingURL=build-message-folder-associations-to-insert.util.js.map