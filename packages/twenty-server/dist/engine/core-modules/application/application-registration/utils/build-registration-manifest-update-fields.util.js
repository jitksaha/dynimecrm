"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildRegistrationManifestUpdateFields", {
    enumerable: true,
    get: function() {
        return buildRegistrationManifestUpdateFields;
    }
});
const _frommanifestapplicationtodisplayfieldsutil = require("./from-manifest-application-to-display-fields.util");
const buildRegistrationManifestUpdateFields = ({ manifestApplication, existingGalleryImages })=>{
    const displayFields = (0, _frommanifestapplicationtodisplayfieldsutil.fromManifestApplicationToDisplayFields)(manifestApplication);
    const existingFileIdByPath = new Map((existingGalleryImages ?? []).map(({ path, fileId })=>[
            path,
            fileId
        ]));
    return {
        ...displayFields,
        galleryImages: displayFields.galleryImages.map((galleryImage)=>({
                ...galleryImage,
                fileId: existingFileIdByPath.get(galleryImage.path) ?? null
            }))
    };
};

//# sourceMappingURL=build-registration-manifest-update-fields.util.js.map