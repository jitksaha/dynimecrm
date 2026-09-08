"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _promises = require("node:fs/promises");
const _os = require("os");
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _stream = require("stream");
const _filestorageexception = require("../../interfaces/file-storage-exception");
const _localdriver = require("../local.driver");
const _streamtobuffer = require("../../../../../utils/stream-to-buffer");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('LocalDriver', ()=>{
    const cleanupPaths = [];
    const createTempDirectory = async (prefix)=>{
        const dir = await (0, _promises.mkdtemp)(_path.default.join((0, _os.tmpdir)(), prefix));
        cleanupPaths.push(dir);
        return dir;
    };
    afterAll(async ()=>{
        await Promise.all(cleanupPaths.map(async (directoryPath)=>{
            await (0, _promises.rm)(directoryPath, {
                recursive: true,
                force: true
            });
        }));
    });
    describe('readFile', ()=>{
        it('should read only the requested byte range', async ()=>{
            const storagePath = await createTempDirectory('local-driver-storage-');
            const folderPath = _path.default.join(storagePath, 'workspace', 'app');
            await (0, _promises.mkdir)(folderPath, {
                recursive: true
            });
            await (0, _promises.writeFile)(_path.default.join(folderPath, 'file.txt'), '0123456789');
            const driver = new _localdriver.LocalDriver({
                storagePath
            });
            const stream = await driver.readFile({
                filePath: 'workspace/app/file.txt',
                byteRange: {
                    startByte: 2,
                    endByte: 5
                }
            });
            await expect((0, _streamtobuffer.streamToBuffer)(stream)).resolves.toEqual(Buffer.from('2345'));
        });
    });
    it('should reject writeFile when target is a symlink', async ()=>{
        const storagePath = await createTempDirectory('local-driver-storage-');
        const outsidePath = await createTempDirectory('local-driver-outside-');
        const outsideFilePath = _path.default.join(outsidePath, 'outside.txt');
        const symlinkFolderPath = _path.default.join(storagePath, 'workspace', 'app');
        const symlinkFilePath = _path.default.join(symlinkFolderPath, 'target.txt');
        await (0, _promises.mkdir)(symlinkFolderPath, {
            recursive: true
        });
        await (0, _promises.writeFile)(outsideFilePath, 'outside');
        await (0, _promises.symlink)(outsideFilePath, symlinkFilePath);
        const driver = new _localdriver.LocalDriver({
            storagePath
        });
        await expect(driver.writeFile({
            filePath: 'workspace/app/target.txt',
            sourceFile: Buffer.from('new-content'),
            mimeType: undefined
        })).rejects.toMatchObject({
            code: _filestorageexception.FileStorageExceptionCode.ACCESS_DENIED
        });
        await expect((0, _promises.readFile)(outsideFilePath, 'utf8')).resolves.toBe('outside');
    });
    it('should reject downloadFile when path resolves outside storage', async ()=>{
        const storagePath = await createTempDirectory('local-driver-storage-');
        const outsidePath = await createTempDirectory('local-driver-outside-');
        const outsideFilePath = _path.default.join(outsidePath, 'outside.txt');
        const symlinkFolderPath = _path.default.join(storagePath, 'workspace', 'app');
        const symlinkFilePath = _path.default.join(symlinkFolderPath, 'target.txt');
        const downloadDestinationPath = _path.default.join(storagePath, 'download', 'file.txt');
        await (0, _promises.mkdir)(symlinkFolderPath, {
            recursive: true
        });
        await (0, _promises.writeFile)(outsideFilePath, 'outside');
        await (0, _promises.symlink)(outsideFilePath, symlinkFilePath);
        const driver = new _localdriver.LocalDriver({
            storagePath
        });
        await expect(driver.downloadFile({
            onStoragePath: 'workspace/app/target.txt',
            localPath: downloadDestinationPath
        })).rejects.toMatchObject({
            code: _filestorageexception.FileStorageExceptionCode.ACCESS_DENIED
        });
    });
    describe('writeFileStream', ()=>{
        it('should write the streamed content to disk', async ()=>{
            const storagePath = await createTempDirectory('local-driver-storage-');
            const driver = new _localdriver.LocalDriver({
                storagePath
            });
            await driver.writeFileStream({
                filePath: 'workspace/app/streamed.txt',
                stream: _stream.Readable.from([
                    Buffer.from('streamed-'),
                    Buffer.from('content')
                ]),
                mimeType: 'text/plain'
            });
            await expect((0, _promises.readFile)(_path.default.join(storagePath, 'workspace/app/streamed.txt'), 'utf8')).resolves.toBe('streamed-content');
        });
        it('should reject when target is a symlink', async ()=>{
            const storagePath = await createTempDirectory('local-driver-storage-');
            const outsidePath = await createTempDirectory('local-driver-outside-');
            const outsideFilePath = _path.default.join(outsidePath, 'outside.txt');
            const symlinkFolderPath = _path.default.join(storagePath, 'workspace', 'app');
            const symlinkFilePath = _path.default.join(symlinkFolderPath, 'target.txt');
            await (0, _promises.mkdir)(symlinkFolderPath, {
                recursive: true
            });
            await (0, _promises.writeFile)(outsideFilePath, 'outside');
            await (0, _promises.symlink)(outsideFilePath, symlinkFilePath);
            const driver = new _localdriver.LocalDriver({
                storagePath
            });
            await expect(driver.writeFileStream({
                filePath: 'workspace/app/target.txt',
                stream: _stream.Readable.from([
                    Buffer.from('new-content')
                ]),
                mimeType: undefined
            })).rejects.toMatchObject({
                code: _filestorageexception.FileStorageExceptionCode.ACCESS_DENIED
            });
            await expect((0, _promises.readFile)(outsideFilePath, 'utf8')).resolves.toBe('outside');
        });
        it('should remove the partial file when the stream errors', async ()=>{
            const storagePath = await createTempDirectory('local-driver-storage-');
            const driver = new _localdriver.LocalDriver({
                storagePath
            });
            const failingStream = new _stream.Readable({
                read () {
                    this.push(Buffer.from('partial'));
                    this.destroy(new Error('stream interrupted'));
                }
            });
            await expect(driver.writeFileStream({
                filePath: 'workspace/app/partial.txt',
                stream: failingStream,
                mimeType: undefined
            })).rejects.toThrow('stream interrupted');
            await expect((0, _promises.stat)(_path.default.join(storagePath, 'workspace/app/partial.txt'))).rejects.toMatchObject({
                code: 'ENOENT'
            });
        });
    });
    describe('getFileMetadata', ()=>{
        it('should return the file size', async ()=>{
            const storagePath = await createTempDirectory('local-driver-storage-');
            const folderPath = _path.default.join(storagePath, 'workspace', 'app');
            await (0, _promises.mkdir)(folderPath, {
                recursive: true
            });
            await (0, _promises.writeFile)(_path.default.join(folderPath, 'file.txt'), '12345');
            const driver = new _localdriver.LocalDriver({
                storagePath
            });
            await expect(driver.getFileMetadata({
                filePath: 'workspace/app/file.txt'
            })).resolves.toEqual({
                size: 5
            });
        });
        it('should return null when the file does not exist', async ()=>{
            const storagePath = await createTempDirectory('local-driver-storage-');
            const driver = new _localdriver.LocalDriver({
                storagePath
            });
            await expect(driver.getFileMetadata({
                filePath: 'workspace/app/missing.txt'
            })).resolves.toBeNull();
        });
    });
    describe('getPresignedUploadUrl', ()=>{
        it('should return null so callers fall back to the server endpoint', async ()=>{
            const storagePath = await createTempDirectory('local-driver-storage-');
            const driver = new _localdriver.LocalDriver({
                storagePath
            });
            await expect(driver.getPresignedUploadUrl()).resolves.toBeNull();
        });
    });
});

//# sourceMappingURL=local.driver.spec.js.map