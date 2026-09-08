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
    get IMMUTABLE_FILE_CACHE_CONTROL () {
        return IMMUTABLE_FILE_CACHE_CONTROL;
    },
    get PRESIGNED_URL_NO_STORE_CACHE_CONTROL () {
        return PRESIGNED_URL_NO_STORE_CACHE_CONTROL;
    },
    get PUBLIC_ASSET_CACHE_CONTROL () {
        return PUBLIC_ASSET_CACHE_CONTROL;
    },
    get fileFolderConfigs () {
        return fileFolderConfigs;
    }
});
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
(0, _graphql.registerEnumType)(_types.FileFolder, {
    name: 'FileFolder'
});
const IMMUTABLE_FILE_CACHE_CONTROL = 'private, max-age=86400, immutable';
const PUBLIC_ASSET_CACHE_CONTROL = 'public, max-age=3600';
const PRESIGNED_URL_NO_STORE_CACHE_CONTROL = 'private, no-store';
const fileFolderConfigs = {
    [_types.FileFolder.CorePicture]: {
        ignoreExpirationToken: true,
        cacheControl: IMMUTABLE_FILE_CACHE_CONTROL
    },
    [_types.FileFolder.AgentChat]: {
        ignoreExpirationToken: false,
        cacheControl: IMMUTABLE_FILE_CACHE_CONTROL
    },
    [_types.FileFolder.BuiltLogicFunction]: {
        ignoreExpirationToken: false,
        cacheControl: null
    },
    [_types.FileFolder.BuiltFrontComponent]: {
        ignoreExpirationToken: false,
        cacheControl: IMMUTABLE_FILE_CACHE_CONTROL
    },
    [_types.FileFolder.PublicAsset]: {
        ignoreExpirationToken: true,
        cacheControl: PUBLIC_ASSET_CACHE_CONTROL
    },
    [_types.FileFolder.Source]: {
        ignoreExpirationToken: false,
        cacheControl: null
    },
    [_types.FileFolder.FilesField]: {
        ignoreExpirationToken: false,
        cacheControl: IMMUTABLE_FILE_CACHE_CONTROL
    },
    [_types.FileFolder.Dependencies]: {
        ignoreExpirationToken: false,
        cacheControl: null
    },
    [_types.FileFolder.Workflow]: {
        ignoreExpirationToken: false,
        cacheControl: IMMUTABLE_FILE_CACHE_CONTROL
    },
    [_types.FileFolder.EmailAttachment]: {
        ignoreExpirationToken: false,
        cacheControl: IMMUTABLE_FILE_CACHE_CONTROL
    },
    [_types.FileFolder.EmailImage]: {
        ignoreExpirationToken: true,
        cacheControl: IMMUTABLE_FILE_CACHE_CONTROL,
        allowedMimeTypes: _constants.EMAIL_IMAGE_MIME_TYPES
    },
    [_types.FileFolder.AppTarball]: {
        ignoreExpirationToken: false,
        cacheControl: null
    },
    [_types.FileFolder.GeneratedSdkClient]: {
        ignoreExpirationToken: false,
        cacheControl: null
    },
    [_types.FileFolder.Dpa]: {
        ignoreExpirationToken: false,
        cacheControl: IMMUTABLE_FILE_CACHE_CONTROL
    }
};

//# sourceMappingURL=file-folder.interface.js.map