"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRecordImageIdentifier", {
    enumerable: true,
    get: function() {
        return getRecordImageIdentifier;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _extractfileidfromurlutil = require("../../file/files-field/utils/extract-file-id-from-url.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _geteffectiveimageidentifierfieldmetadataidutil = require("../../../metadata-modules/object-metadata/utils/get-effective-image-identifier-field-metadata-id.util");
const _types = require("twenty-shared/types");
const getRecordImageIdentifier = async ({ record, flatObjectMetadata, flatFieldMetadataMaps, allowRequestsToTwentyIcons, signUrl })=>{
    if (signUrl && flatObjectMetadata.nameSingular === 'workspaceMember' && (0, _guards.isNonEmptyString)(record.avatarUrl)) {
        const avatarFileId = (0, _extractfileidfromurlutil.extractFileIdFromUrl)(record.avatarUrl, _types.FileFolder.CorePicture);
        if (!(0, _utils.isDefined)(avatarFileId)) {
            return null;
        }
        return signUrl(avatarFileId, _types.FileFolder.CorePicture);
    }
    const imageIdentifierFieldMetadataId = (0, _geteffectiveimageidentifierfieldmetadataidutil.getEffectiveImageIdentifierFieldMetadataId)(flatObjectMetadata);
    if (!(0, _utils.isDefined)(imageIdentifierFieldMetadataId)) {
        return null;
    }
    const imageIdentifierField = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityMaps: flatFieldMetadataMaps,
        flatEntityId: imageIdentifierFieldMetadataId
    });
    if (!(0, _utils.isDefined)(imageIdentifierField)) {
        return null;
    }
    const imageValue = record[imageIdentifierField.name];
    if (!(0, _utils.isDefined)(imageValue)) {
        return null;
    }
    switch(imageIdentifierField.type){
        case _types.FieldMetadataType.FILES:
            {
                const fileId = Array.isArray(imageValue) ? imageValue[0]?.fileId : undefined;
                if (!(0, _guards.isNonEmptyString)(fileId) || !(0, _utils.isDefined)(signUrl)) {
                    return null;
                }
                return signUrl(fileId, _types.FileFolder.FilesField);
            }
        case _types.FieldMetadataType.LINKS:
            {
                if (!allowRequestsToTwentyIcons) {
                    return null;
                }
                const primaryLinkUrl = typeof imageValue === 'object' && 'primaryLinkUrl' in imageValue ? imageValue.primaryLinkUrl : undefined;
                return (0, _guards.isNonEmptyString)(primaryLinkUrl) ? (0, _utils.getLinkFaviconUrl)(primaryLinkUrl) || null : null;
            }
        default:
            {
                return null;
            }
    }
};

//# sourceMappingURL=get-record-image-identifier.util.js.map