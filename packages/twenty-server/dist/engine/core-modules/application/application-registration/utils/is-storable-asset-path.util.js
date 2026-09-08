"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isStorableAssetPath", {
    enumerable: true,
    get: function() {
        return isStorableAssetPath;
    }
});
const _utils = require("twenty-shared/utils");
const _isimagefilepathutil = require("./is-image-file-path.util");
const isStorableAssetPath = (path)=>!(0, _utils.isAbsoluteUrl)(path) && (0, _isimagefilepathutil.isImageFilePath)(path);

//# sourceMappingURL=is-storable-asset-path.util.js.map