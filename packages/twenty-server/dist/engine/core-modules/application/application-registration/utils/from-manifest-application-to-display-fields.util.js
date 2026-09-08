"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromManifestApplicationToDisplayFields", {
    enumerable: true,
    get: function() {
        return fromManifestApplicationToDisplayFields;
    }
});
const _togalleryimagepathsutil = require("./to-gallery-image-paths.util");
const fromManifestApplicationToDisplayFields = (application)=>({
        logo: application?.logo ?? application?.logoUrl ?? null,
        description: application?.description ?? null,
        author: application?.author ?? null,
        category: application?.category ?? null,
        websiteUrl: application?.websiteUrl ?? null,
        aboutDescription: application?.aboutDescription ?? null,
        termsUrl: application?.termsUrl ?? null,
        emailSupport: application?.emailSupport ?? null,
        issueReportUrl: application?.issueReportUrl ?? null,
        galleryImages: (0, _togalleryimagepathsutil.toGalleryImagePaths)(application).map((path)=>({
                path,
                fileId: null
            }))
    });

//# sourceMappingURL=from-manifest-application-to-display-fields.util.js.map