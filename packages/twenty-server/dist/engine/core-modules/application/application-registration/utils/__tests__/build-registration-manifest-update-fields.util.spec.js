"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildregistrationmanifestupdatefieldsutil = require("../build-registration-manifest-update-fields.util");
describe('buildRegistrationManifestUpdateFields', ()=>{
    it('should keep stored fileIds for gallery paths that did not change', ()=>{
        const result = (0, _buildregistrationmanifestupdatefieldsutil.buildRegistrationManifestUpdateFields)({
            manifestApplication: {
                universalIdentifier: 'my-app',
                galleryImages: [
                    'images/kept.png',
                    'images/new.png'
                ]
            },
            existingGalleryImages: [
                {
                    path: 'images/kept.png',
                    fileId: 'file-kept'
                },
                {
                    path: 'images/removed.png',
                    fileId: 'file-removed'
                }
            ]
        });
        expect(result.galleryImages).toEqual([
            {
                path: 'images/kept.png',
                fileId: 'file-kept'
            },
            {
                path: 'images/new.png',
                fileId: null
            }
        ]);
    });
    it('should handle a missing manifest application and no stored images', ()=>{
        const result = (0, _buildregistrationmanifestupdatefieldsutil.buildRegistrationManifestUpdateFields)({
            manifestApplication: undefined,
            existingGalleryImages: null
        });
        expect(result.galleryImages).toEqual([]);
        expect(result.logo).toBeNull();
    });
});

//# sourceMappingURL=build-registration-manifest-update-fields.util.spec.js.map