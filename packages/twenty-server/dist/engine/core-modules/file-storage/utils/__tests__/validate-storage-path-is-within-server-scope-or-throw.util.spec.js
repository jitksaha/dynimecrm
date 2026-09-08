"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _filestorageexception = require("../../interfaces/file-storage-exception");
const _validatestoragepathiswithinserverscopeorthrowutil = require("../validate-storage-path-is-within-server-scope-or-throw.util");
const primitives = {
    fileFolder: _types.ServerFileFolder.ApplicationRegistration
};
describe('validateStoragePathIsWithinServerScopeOrThrow', ()=>{
    it.each([
        {
            title: 'nested path within prefix',
            onStoragePath: 'server/application-registration/manifests/manifest.json'
        },
        {
            title: 'file directly under prefix',
            onStoragePath: 'server/application-registration/manifest.json'
        }
    ])('should accept valid path: $title', ({ onStoragePath })=>{
        expect(()=>(0, _validatestoragepathiswithinserverscopeorthrowutil.validateStoragePathIsWithinServerScopeOrThrow)({
                onStoragePath,
                ...primitives
            })).not.toThrow();
    });
    it.each([
        {
            title: 'workspace-like prefix instead of server prefix',
            onStoragePath: 'workspace-id/app-uid/source/file.json'
        },
        {
            title: 'different file folder',
            onStoragePath: 'server/other-folder/file.json'
        },
        {
            title: 'prefix without trailing file',
            onStoragePath: 'server/application-registration'
        },
        {
            title: 'partial prefix match (malicious suffix)',
            onStoragePath: 'server/application-registrationMalicious/file.json'
        },
        {
            title: 'traversal out of the server prefix',
            onStoragePath: 'server/application-registration/../../workspace-id/file.json'
        },
        {
            title: 'traversal segments kept after normalization',
            onStoragePath: 'server/application-registration/../../../etc/passwd'
        },
        {
            title: 'absolute path',
            onStoragePath: '/server/application-registration/file.json'
        },
        {
            title: 'null byte in path',
            onStoragePath: 'server/application-registration/file\0.json'
        }
    ])('should reject path that escapes server scope: $title', ({ onStoragePath })=>{
        expect(()=>(0, _validatestoragepathiswithinserverscopeorthrowutil.validateStoragePathIsWithinServerScopeOrThrow)({
                onStoragePath,
                ...primitives
            })).toThrow(expect.objectContaining({
            code: _filestorageexception.FileStorageExceptionCode.ACCESS_DENIED
        }));
    });
});

//# sourceMappingURL=validate-storage-path-is-within-server-scope-or-throw.util.spec.js.map