"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _testing = require("@nestjs/testing");
const _sdkclientmodulecachecontrol = require("../constants/sdk-client-module-cache-control");
const _sdkclientcontroller = require("../controllers/sdk-client.controller");
const _sdkclientarchiveservice = require("../sdk-client-archive.service");
const _getinstalledsdkmetadatamoduleutil = require("../utils/get-installed-sdk-metadata-module.util");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
jest.mock('src/engine/core-modules/sdk-client/utils/get-installed-sdk-metadata-module.util', ()=>({
        getInstalledSdkMetadataModule: jest.fn()
    }));
const mockGetInstalledSdkMetadataModule = jest.mocked(_getinstalledsdkmetadatamoduleutil.getInstalledSdkMetadataModule);
const WORKSPACE_ID = 'workspace-1';
const APPLICATION_ID = 'app-1';
const CORE_MODULE_BUFFER = Buffer.from('core module from archive');
const PERSISTED_CORE_CHECKSUM = 'b'.repeat(64);
const workspace = {
    id: WORKSPACE_ID
};
describe('SdkClientController', ()=>{
    let controller;
    let workspaceCacheService;
    let sdkClientArchiveService;
    let response;
    beforeEach(async ()=>{
        jest.clearAllMocks();
        workspaceCacheService = {
            getOrRecompute: jest.fn().mockResolvedValue({
                flatApplicationMaps: {
                    byId: {
                        [APPLICATION_ID]: {
                            id: APPLICATION_ID,
                            universalIdentifier: 'my-app',
                            sdkClientCoreChecksum: PERSISTED_CORE_CHECKSUM
                        }
                    }
                }
            })
        };
        sdkClientArchiveService = {
            getClientModuleFromArchive: jest.fn().mockResolvedValue(CORE_MODULE_BUFFER)
        };
        response = {
            setHeader: jest.fn(),
            send: jest.fn()
        };
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _sdkclientcontroller.SdkClientController
            ],
            providers: [
                {
                    provide: _workspacecacheservice.WorkspaceCacheService,
                    useValue: workspaceCacheService
                },
                {
                    provide: _sdkclientarchiveservice.SdkClientArchiveService,
                    useValue: sdkClientArchiveService
                }
            ]
        }).compile();
        controller = module.get(_sdkclientcontroller.SdkClientController);
    });
    describe('instance-wide metadata route', ()=>{
        const INSTALLED_METADATA_BUFFER = Buffer.from('installed metadata module');
        const INSTALLED_METADATA_CHECKSUM = 'a'.repeat(64);
        beforeEach(()=>{
            mockGetInstalledSdkMetadataModule.mockResolvedValue({
                moduleBuffer: INSTALLED_METADATA_BUFFER,
                checksum: INSTALLED_METADATA_CHECKSUM
            });
        });
        it('serves the installed metadata module without touching workspace caches', async ()=>{
            await controller.getInstanceSdkMetadataModule(response);
            expect(workspaceCacheService.getOrRecompute).not.toHaveBeenCalled();
            expect(sdkClientArchiveService.getClientModuleFromArchive).not.toHaveBeenCalled();
            expect(response.send).toHaveBeenCalledWith(INSTALLED_METADATA_BUFFER);
        });
        it('opts out of caching on the bare url', async ()=>{
            await controller.getInstanceSdkMetadataModule(response);
            expect(response.setHeader).toHaveBeenCalledWith('Cache-Control', _sdkclientmodulecachecontrol.SDK_CLIENT_MODULE_NO_STORE_CACHE_CONTROL);
        });
        it('serves fingerprinted urls as immutable when the checksum matches the installed module', async ()=>{
            await controller.getInstanceSdkMetadataModule(response, INSTALLED_METADATA_CHECKSUM);
            expect(response.setHeader).toHaveBeenCalledWith('Cache-Control', _sdkclientmodulecachecontrol.SDK_CLIENT_MODULE_CACHE_CONTROL);
        });
        it('opts out of caching when the fingerprint does not match the installed module', async ()=>{
            await controller.getInstanceSdkMetadataModule(response, 'c'.repeat(64));
            expect(response.setHeader).toHaveBeenCalledWith('Cache-Control', _sdkclientmodulecachecontrol.SDK_CLIENT_MODULE_NO_STORE_CACHE_CONTROL);
        });
    });
    it('serves the metadata module from the installed package, not the archive', async ()=>{
        const installedModuleBuffer = Buffer.from('installed metadata module');
        mockGetInstalledSdkMetadataModule.mockResolvedValue({
            moduleBuffer: installedModuleBuffer,
            checksum: 'a'.repeat(64)
        });
        await controller.getSdkModule(response, APPLICATION_ID, 'metadata', workspace);
        expect(sdkClientArchiveService.getClientModuleFromArchive).not.toHaveBeenCalled();
        expect(response.send).toHaveBeenCalledWith(installedModuleBuffer);
    });
    it('serves the core module from the application archive', async ()=>{
        await controller.getSdkModule(response, APPLICATION_ID, 'core', workspace);
        expect(sdkClientArchiveService.getClientModuleFromArchive).toHaveBeenCalledWith({
            workspaceId: WORKSPACE_ID,
            applicationId: APPLICATION_ID,
            applicationUniversalIdentifier: 'my-app',
            moduleName: 'core'
        });
        expect(mockGetInstalledSdkMetadataModule).not.toHaveBeenCalled();
    });
    it('disables MIME sniffing and opts out of HTTP caching on the bare fallback url', async ()=>{
        await controller.getSdkModule(response, APPLICATION_ID, 'core', workspace);
        expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/javascript');
        expect(response.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
        expect(response.setHeader).toHaveBeenCalledWith('Cache-Control', _sdkclientmodulecachecontrol.SDK_CLIENT_MODULE_NO_STORE_CACHE_CONTROL);
    });
    it('serves fingerprinted urls as immutable when the checksum matches the persisted core checksum', async ()=>{
        await controller.getSdkModule(response, APPLICATION_ID, 'core', workspace, PERSISTED_CORE_CHECKSUM);
        expect(response.setHeader).toHaveBeenCalledWith('Cache-Control', _sdkclientmodulecachecontrol.SDK_CLIENT_MODULE_CACHE_CONTROL);
    });
    it('opts out of caching when the fingerprint does not match the persisted checksum', async ()=>{
        await controller.getSdkModule(response, APPLICATION_ID, 'core', workspace, 'a'.repeat(64));
        expect(response.setHeader).toHaveBeenCalledWith('Cache-Control', _sdkclientmodulecachecontrol.SDK_CLIENT_MODULE_NO_STORE_CACHE_CONTROL);
    });
    it('rejects unknown module names', async ()=>{
        await expect(controller.getSdkModule(response, APPLICATION_ID, 'evil', workspace)).rejects.toBeInstanceOf(_common.NotFoundException);
    });
    it('rejects unknown applications', async ()=>{
        await expect(controller.getSdkModule(response, 'unknown-app', 'metadata', workspace)).rejects.toBeInstanceOf(_common.NotFoundException);
    });
});

//# sourceMappingURL=sdk-client.controller.spec.js.map