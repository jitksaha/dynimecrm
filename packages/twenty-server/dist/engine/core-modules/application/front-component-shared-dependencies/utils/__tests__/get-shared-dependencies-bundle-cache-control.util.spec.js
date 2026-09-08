"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getshareddependenciesbundlecachecontrolutil = require("../get-shared-dependencies-bundle-cache-control.util");
const _filefolderinterface = require("../../../../file/interfaces/file-folder.interface");
const CHECKSUM = 'a'.repeat(64);
describe('getSharedDependenciesBundleCacheControl', ()=>{
    it('returns the immutable cache control when the requested checksum matches', ()=>{
        expect((0, _getshareddependenciesbundlecachecontrolutil.getSharedDependenciesBundleCacheControl)({
            requestedChecksum: CHECKSUM,
            frontComponentSharedDependenciesChecksum: CHECKSUM
        })).toBe(_filefolderinterface.IMMUTABLE_FILE_CACHE_CONTROL);
    });
    it.each([
        [
            'the requested checksum differs',
            'b'.repeat(64),
            CHECKSUM
        ],
        [
            'no checksum was requested',
            undefined,
            CHECKSUM
        ],
        [
            'the application has no checksum',
            CHECKSUM,
            null
        ]
    ])('returns no-store when %s', (_label, requestedChecksum, storedChecksum)=>{
        expect((0, _getshareddependenciesbundlecachecontrolutil.getSharedDependenciesBundleCacheControl)({
            requestedChecksum,
            frontComponentSharedDependenciesChecksum: storedChecksum
        })).toBe(_filefolderinterface.PRESIGNED_URL_NO_STORE_CACHE_CONTROL);
    });
});

//# sourceMappingURL=get-shared-dependencies-bundle-cache-control.util.spec.js.map