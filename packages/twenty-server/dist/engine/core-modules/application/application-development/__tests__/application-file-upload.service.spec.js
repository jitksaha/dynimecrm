"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _types = require("twenty-shared/types");
const _applicationfileuploadservice = require("../application-file-upload.service");
const _applicationexception = require("../../application.exception");
const _applicationservice = require("../../application.service");
const _fileentity = require("../../../file/entities/file.entity");
const _fileuploadcompletionservice = require("../../../file/file-upload/services/file-upload-completion.service");
const _fileuploadtargetservice = require("../../../file/file-upload/services/file-upload-target.service");
const _getworkspacescopedrepositorytokenutil = require("../../../../twenty-orm/workspace-scoped-repository/get-workspace-scoped-repository-token.util");
const WORKSPACE_ID = 'workspace-id';
const APPLICATION_UNIVERSAL_IDENTIFIER = 'application-uid';
describe('ApplicationFileUploadService', ()=>{
    let service;
    const applicationService = {
        findByUniversalIdentifier: jest.fn().mockResolvedValue({
            id: 'application-id',
            universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER
        })
    };
    const fileUploadTargetService = {
        createUploadTargetsBatch: jest.fn()
    };
    const fileUploadCompletionService = {
        completeUploadsBatch: jest.fn()
    };
    const fileRepository = {
        find: jest.fn()
    };
    beforeEach(async ()=>{
        jest.clearAllMocks();
        fileUploadTargetService.createUploadTargetsBatch.mockImplementation((requests)=>Promise.resolve(requests.map((request, index)=>({
                    success: true,
                    value: {
                        fileId: `file-id-${index}`,
                        uploadUrl: `https://storage.tld/${request.resourcePath}`,
                        contentType: 'application/octet-stream',
                        expiresAt: new Date('2026-01-01T00:00:00.000Z')
                    }
                }))));
        const module = await _testing.Test.createTestingModule({
            providers: [
                _applicationfileuploadservice.ApplicationFileUploadService,
                {
                    provide: _applicationservice.ApplicationService,
                    useValue: applicationService
                },
                {
                    provide: _fileuploadtargetservice.FileUploadTargetService,
                    useValue: fileUploadTargetService
                },
                {
                    provide: _fileuploadcompletionservice.FileUploadCompletionService,
                    useValue: fileUploadCompletionService
                },
                {
                    provide: (0, _getworkspacescopedrepositorytokenutil.getWorkspaceScopedRepositoryToken)(_fileentity.FileEntity),
                    useValue: fileRepository
                }
            ]
        }).compile();
        service = module.get(_applicationfileuploadservice.ApplicationFileUploadService);
    });
    describe('createApplicationFileUploads', ()=>{
        it('should return one upload target per valid file, delegating to the batch primitive', async ()=>{
            const result = await service.createApplicationFileUploads({
                workspaceId: WORKSPACE_ID,
                applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
                files: [
                    {
                        fileFolder: _types.FileFolder.BuiltLogicFunction,
                        filePath: 'handler.mjs',
                        size: 12
                    },
                    {
                        fileFolder: _types.FileFolder.PublicAsset,
                        filePath: 'logo.png',
                        size: 34
                    }
                ]
            });
            expect(result.errors).toEqual([]);
            expect(result.targets).toHaveLength(2);
            expect(result.targets[0].filePath).toBe('handler.mjs');
            expect(result.targets[0].fileFolder).toBe(_types.FileFolder.BuiltLogicFunction);
            expect(result.targets[0].uploadUrl).toContain('https://storage.tld/');
            expect(result.targets[1].filePath).toBe('logo.png');
            expect(fileUploadTargetService.createUploadTargetsBatch).toHaveBeenCalledTimes(1);
        });
        it('should reserve pending files as octet-stream through the batch primitive', async ()=>{
            await service.createApplicationFileUploads({
                workspaceId: WORKSPACE_ID,
                applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
                files: [
                    {
                        fileFolder: _types.FileFolder.Source,
                        filePath: 'src/index.ts',
                        size: 12
                    }
                ]
            });
            expect(fileUploadTargetService.createUploadTargetsBatch).toHaveBeenCalledWith([
                expect.objectContaining({
                    workspaceId: WORKSPACE_ID,
                    applicationId: 'application-id',
                    fileFolder: _types.FileFolder.Source,
                    resourcePath: 'src/index.ts',
                    size: 12
                })
            ]);
        });
        it('should collect a per-file error and skip the batch for a disallowed file folder', async ()=>{
            const result = await service.createApplicationFileUploads({
                workspaceId: WORKSPACE_ID,
                applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
                files: [
                    {
                        fileFolder: _types.FileFolder.FilesField,
                        filePath: 'document.pdf',
                        size: 12
                    }
                ]
            });
            expect(result.targets).toEqual([]);
            expect(result.errors).toEqual([
                {
                    fileFolder: _types.FileFolder.FilesField,
                    filePath: 'document.pdf',
                    message: expect.stringContaining('Invalid fileFolder')
                }
            ]);
            expect(fileUploadTargetService.createUploadTargetsBatch).toHaveBeenCalledWith([]);
        });
        it('should fail slow: a path escaping the folder becomes a per-file error while valid files still upload', async ()=>{
            const result = await service.createApplicationFileUploads({
                workspaceId: WORKSPACE_ID,
                applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
                files: [
                    {
                        fileFolder: _types.FileFolder.Source,
                        filePath: 'src/index.ts',
                        size: 12
                    },
                    {
                        fileFolder: _types.FileFolder.Source,
                        filePath: '../../../etc/passwd',
                        size: 12
                    }
                ]
            });
            expect(result.targets).toHaveLength(1);
            expect(result.targets[0].filePath).toBe('src/index.ts');
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0].filePath).toBe('../../../etc/passwd');
            expect(fileUploadTargetService.createUploadTargetsBatch).toHaveBeenCalledWith([
                expect.objectContaining({
                    resourcePath: 'src/index.ts'
                })
            ]);
        });
        it('should collect a per-file error for a file larger than the direct upload limit', async ()=>{
            const result = await service.createApplicationFileUploads({
                workspaceId: WORKSPACE_ID,
                applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
                files: [
                    {
                        fileFolder: _types.FileFolder.Source,
                        filePath: 'src/index.ts',
                        size: 2 * 1024 * 1024 * 1024
                    }
                ]
            });
            expect(result.targets).toEqual([]);
            expect(result.errors[0].message).toContain('above the');
        });
        it('should surface a batch-primitive failure as a per-file error', async ()=>{
            fileUploadTargetService.createUploadTargetsBatch.mockResolvedValueOnce([
                {
                    success: false,
                    error: 'storage exploded'
                }
            ]);
            const result = await service.createApplicationFileUploads({
                workspaceId: WORKSPACE_ID,
                applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
                files: [
                    {
                        fileFolder: _types.FileFolder.Source,
                        filePath: 'src/index.ts',
                        size: 12
                    }
                ]
            });
            expect(result.targets).toEqual([]);
            expect(result.errors).toEqual([
                {
                    fileFolder: _types.FileFolder.Source,
                    filePath: 'src/index.ts',
                    message: 'storage exploded'
                }
            ]);
        });
        it('should throw when the application does not exist in the workspace', async ()=>{
            applicationService.findByUniversalIdentifier.mockResolvedValueOnce(null);
            await expect(service.createApplicationFileUploads({
                workspaceId: WORKSPACE_ID,
                applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
                files: [
                    {
                        fileFolder: _types.FileFolder.Source,
                        filePath: 'src/index.ts',
                        size: 12
                    }
                ]
            })).rejects.toThrow(_applicationexception.ApplicationException);
        });
    });
    describe('completeApplicationFileUploads', ()=>{
        const file = {
            id: 'file-id',
            path: `${_types.FileFolder.BuiltLogicFunction}/handler.mjs`,
            size: 12,
            createdAt: new Date('2026-01-01T00:00:00.000Z')
        };
        it('should return the completed files delegated to the batch primitive', async ()=>{
            fileRepository.find.mockResolvedValueOnce([
                file
            ]);
            fileUploadCompletionService.completeUploadsBatch.mockResolvedValueOnce([
                {
                    success: true,
                    value: {
                        id: 'file-id',
                        path: file.path,
                        size: 12,
                        createdAt: file.createdAt
                    }
                }
            ]);
            const result = await service.completeApplicationFileUploads({
                workspaceId: WORKSPACE_ID,
                applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
                fileIds: [
                    'file-id'
                ]
            });
            expect(result.errors).toEqual([]);
            expect(result.files).toEqual([
                {
                    id: 'file-id',
                    path: file.path,
                    size: 12,
                    createdAt: file.createdAt
                }
            ]);
            expect(fileUploadCompletionService.completeUploadsBatch).toHaveBeenCalledWith([
                expect.objectContaining({
                    workspaceId: WORKSPACE_ID,
                    file
                })
            ]);
        });
        it('should surface a batch-primitive completion failure as a per-file error', async ()=>{
            fileRepository.find.mockResolvedValueOnce([
                file
            ]);
            fileUploadCompletionService.completeUploadsBatch.mockResolvedValueOnce([
                {
                    success: false,
                    error: 'size mismatch'
                }
            ]);
            const result = await service.completeApplicationFileUploads({
                workspaceId: WORKSPACE_ID,
                applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
                fileIds: [
                    'file-id'
                ]
            });
            expect(result.files).toEqual([]);
            expect(result.errors).toEqual([
                {
                    fileId: 'file-id',
                    message: 'size mismatch'
                }
            ]);
        });
        it('should report file ids that do not belong to the application as errors', async ()=>{
            fileRepository.find.mockResolvedValueOnce([]);
            fileUploadCompletionService.completeUploadsBatch.mockResolvedValueOnce([]);
            const result = await service.completeApplicationFileUploads({
                workspaceId: WORKSPACE_ID,
                applicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
                fileIds: [
                    'file-id-from-another-application'
                ]
            });
            expect(result.files).toEqual([]);
            expect(result.errors).toEqual([
                {
                    fileId: 'file-id-from-another-application',
                    message: expect.stringContaining('No pending upload found')
                }
            ]);
        });
    });
});

//# sourceMappingURL=application-file-upload.service.spec.js.map