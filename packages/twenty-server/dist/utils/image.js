"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get fetchImageWithTypeFromUrl () {
        return fetchImageWithTypeFromUrl;
    },
    get getImageBufferFromUrl () {
        return getImageBufferFromUrl;
    }
});
const _pdf = require("@file-type/pdf");
const _guards = require("@sniptt/guards");
const _filetype = require("file-type");
const _utils = require("twenty-shared/utils");
const getImageBufferFromUrl = async (url, axiosInstance)=>{
    if (!(0, _guards.isNonEmptyString)(url) || url.trim().length === 0) {
        throw new Error('Invalid URL provided: URL must be a non-empty string');
    }
    try {
        const response = await axiosInstance.get(url, {
            responseType: 'arraybuffer',
            validateStatus: (status)=>status >= 200 && status < 300,
            maxRedirects: 5,
            timeout: 10000
        });
        if (!response.data) {
            throw new Error('Received empty response from image URL');
        }
        const bufferLength = Buffer.isBuffer(response.data) ? response.data.length : response.data.byteLength;
        if (bufferLength === 0) {
            throw new Error('Received empty response from image URL');
        }
        const contentType = response.headers['content-type'];
        if ((0, _guards.isNonEmptyString)(contentType) && !contentType.startsWith('image/')) {
            throw new Error(`Invalid content type: expected image/*, got ${contentType}`);
        }
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to fetch image from ${url}: ${message}`);
    }
};
const fetchImageWithTypeFromUrl = async (imageUrl, axiosInstance)=>{
    const buffer = await getImageBufferFromUrl(imageUrl, axiosInstance);
    const parser = new _filetype.FileTypeParser({
        customDetectors: [
            _pdf.detectPdf
        ]
    });
    const type = await parser.fromBuffer(buffer);
    if (!(0, _utils.isDefined)(type) || !type.mime.startsWith('image/')) {
        return undefined;
    }
    return {
        buffer,
        extension: type.ext
    };
};

//# sourceMappingURL=image.js.map