"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isImageFilePath", {
    enumerable: true,
    get: function() {
        return isImageFilePath;
    }
});
const ALLOWED_IMAGE_EXTENSIONS = new Set([
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.gif',
    '.svg',
    '.avif'
]);
const isImageFilePath = (filePath)=>{
    const lastDotIndex = filePath.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return false;
    }
    return ALLOWED_IMAGE_EXTENSIONS.has(filePath.slice(lastDotIndex).toLowerCase());
};

//# sourceMappingURL=is-image-file-path.util.js.map