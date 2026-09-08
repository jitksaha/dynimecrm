"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setFileResponseHeaders", {
    enumerable: true,
    get: function() {
        return setFileResponseHeaders;
    }
});
const _utils = require("twenty-shared/utils");
const _filefolderinterface = require("../interfaces/file-folder.interface");
const _getcontentdispositionutils = require("./get-content-disposition.utils");
const setFileResponseHeaders = (res, mimeType, fileFolder)=>{
    const contentType = mimeType || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', (0, _getcontentdispositionutils.getContentDisposition)(contentType));
    const cacheControl = (0, _utils.isDefined)(fileFolder) ? _filefolderinterface.fileFolderConfigs[fileFolder].cacheControl : null;
    if ((0, _utils.isDefined)(cacheControl)) {
        res.setHeader('Cache-Control', cacheControl);
    }
};

//# sourceMappingURL=set-file-response-headers.utils.js.map