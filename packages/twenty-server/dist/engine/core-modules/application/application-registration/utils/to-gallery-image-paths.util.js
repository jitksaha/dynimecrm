"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "toGalleryImagePaths", {
    enumerable: true,
    get: function() {
        return toGalleryImagePaths;
    }
});
const toGalleryImagePaths = (application)=>{
    const galleryImages = application?.galleryImages;
    if (galleryImages && galleryImages.length > 0) {
        return galleryImages;
    }
    return application?.screenshots ?? [];
};

//# sourceMappingURL=to-gallery-image-paths.util.js.map