"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isimagefilepathutil = require("../is-image-file-path.util");
describe('isImageFilePath', ()=>{
    it.each([
        'public/logo.png',
        'public/shot.JPG',
        'a/b/c.jpeg',
        'image.webp',
        'anim.gif',
        'icon.svg',
        'photo.avif'
    ])('returns true for image path %s', (filePath)=>{
        expect((0, _isimagefilepathutil.isImageFilePath)(filePath)).toBe(true);
    });
    it.each([
        'public/data.json',
        'public/styles.css',
        'script.mjs',
        'README',
        'archive.tar.gz',
        'noextension'
    ])('returns false for non-image path %s', (filePath)=>{
        expect((0, _isimagefilepathutil.isImageFilePath)(filePath)).toBe(false);
    });
});

//# sourceMappingURL=is-image-file-path.util.spec.js.map