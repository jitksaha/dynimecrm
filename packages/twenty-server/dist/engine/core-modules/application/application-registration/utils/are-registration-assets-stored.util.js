"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "areRegistrationAssetsStored", {
    enumerable: true,
    get: function() {
        return areRegistrationAssetsStored;
    }
});
const _utils = require("twenty-shared/utils");
const _isstorableassetpathutil = require("./is-storable-asset-path.util");
const _togalleryimagepathsutil = require("./to-gallery-image-paths.util");
const areRegistrationAssetsStored = (registration, manifestApplication)=>{
    const logoPath = manifestApplication?.logo ?? manifestApplication?.logoUrl;
    if ((0, _utils.isDefined)(logoPath) && (0, _isstorableassetpathutil.isStorableAssetPath)(logoPath) && !(0, _utils.isDefined)(registration.logoFileId)) {
        return false;
    }
    const storedFileIdByPath = new Map((registration.galleryImages ?? []).map(({ path, fileId })=>[
            path,
            fileId
        ]));
    return (0, _togalleryimagepathsutil.toGalleryImagePaths)(manifestApplication).filter(_isstorableassetpathutil.isStorableAssetPath).every((path)=>(0, _utils.isDefined)(storedFileIdByPath.get(path)));
};

//# sourceMappingURL=are-registration-assets-stored.util.js.map