"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _applicationregistrationasseturlservice = require("../application-registration-asset-url.service");
const _applicationregistrationentity = require("../application-registration.entity");
const _applicationregistrationservice = require("../application-registration.service");
const _applicationregistrationvariableservice = require("../../application-registration-variable/application-registration-variable.service");
const _applicationregistrationsourcetypeenum = require("../enums/application-registration-source-type.enum");
const _applicationentity = require("../../application.entity");
const _cachelockservice = require("../../../cache-lock/cache-lock.service");
const _coreentitycacheservice = require("../../../../core-entity-cache/services/core-entity-cache.service");
const _serverfilestorageservice = require("../../../file-storage/services/server-file-storage.service");
const _messagequeueconstants = require("../../../message-queue/message-queue.constants");
const _getqueuetokenutil = require("../../../message-queue/utils/get-queue-token.util");
const _metricsservice = require("../../../metrics/metrics.service");
const _workspaceentity = require("../../../workspace/workspace.entity");
describe('ApplicationRegistrationService - upsertFromCatalog', ()=>{
    let service;
    let applicationRegistrationRepository;
    const catalogParams = {
        universalIdentifier: '97141c95-2870-5662-8992-44fb6536be9a',
        name: 'My App',
        sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM,
        sourcePackage: 'twenty-app-my-app',
        latestAvailableVersion: '0.2.0',
        manifest: null
    };
    const buildExistingRegistration = (overrides)=>({
            id: 'registration-id',
            universalIdentifier: catalogParams.universalIdentifier,
            name: 'My App',
            galleryImages: [],
            ...overrides
        });
    beforeEach(async ()=>{
        applicationRegistrationRepository = {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn((entity)=>entity),
            createQueryBuilder: jest.fn(()=>({
                    update: jest.fn().mockReturnThis(),
                    set: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    andWhere: jest.fn().mockReturnThis(),
                    execute: jest.fn().mockResolvedValue({
                        affected: 0
                    })
                }))
        };
        const module = await _testing.Test.createTestingModule({
            providers: [
                _applicationregistrationservice.ApplicationRegistrationService,
                {
                    provide: (0, _typeorm.getRepositoryToken)(_applicationregistrationentity.ApplicationRegistrationEntity),
                    useValue: applicationRegistrationRepository
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_applicationentity.ApplicationEntity),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn()
                    }
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_workspaceentity.WorkspaceEntity),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn()
                    }
                },
                {
                    provide: _applicationregistrationvariableservice.ApplicationRegistrationVariableService,
                    useValue: {
                        syncVariableSchemas: jest.fn()
                    }
                },
                {
                    provide: _applicationregistrationasseturlservice.ApplicationRegistrationAssetUrlService,
                    useValue: {
                        resolveAssetUrls: jest.fn()
                    }
                },
                {
                    provide: _serverfilestorageservice.ServerFileStorageService,
                    useValue: {
                        write: jest.fn(),
                        delete: jest.fn()
                    }
                },
                {
                    provide: _cachelockservice.CacheLockService,
                    useValue: {
                        withLock: jest.fn((_key, fn)=>fn())
                    }
                },
                {
                    provide: _coreentitycacheservice.CoreEntityCacheService,
                    useValue: {
                        invalidate: jest.fn()
                    }
                },
                {
                    provide: _metricsservice.MetricsService,
                    useValue: {
                        incrementCounterBy: jest.fn()
                    }
                },
                {
                    provide: (0, _getqueuetokenutil.getQueueToken)(_messagequeueconstants.MessageQueue.workspaceQueue),
                    useValue: {
                        add: jest.fn()
                    }
                }
            ]
        }).compile();
        service = module.get(_applicationregistrationservice.ApplicationRegistrationService);
    });
    afterEach(()=>{
        jest.clearAllMocks();
    });
    it('should re-list a registration first created by a local install when the catalog serves it', async ()=>{
        applicationRegistrationRepository.findOne.mockResolvedValue(buildExistingRegistration({
            sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL,
            isListed: false
        }));
        await service.upsertFromCatalog(catalogParams);
        expect(applicationRegistrationRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            isListed: true,
            sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM
        }));
    });
    it('should preserve an operator delisting of a registry-sourced registration', async ()=>{
        applicationRegistrationRepository.findOne.mockResolvedValue(buildExistingRegistration({
            sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM,
            isListed: false
        }));
        await service.upsertFromCatalog(catalogParams);
        expect(applicationRegistrationRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            isListed: false
        }));
    });
    it('should keep an already listed registration listed', async ()=>{
        applicationRegistrationRepository.findOne.mockResolvedValue(buildExistingRegistration({
            sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM,
            isListed: true
        }));
        await service.upsertFromCatalog(catalogParams);
        expect(applicationRegistrationRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            isListed: true
        }));
    });
    it('should create new catalog registrations as listed', async ()=>{
        applicationRegistrationRepository.findOne.mockResolvedValue(null);
        await service.upsertFromCatalog(catalogParams);
        expect(applicationRegistrationRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            isListed: true
        }));
    });
});

//# sourceMappingURL=application-registration-upsert-from-catalog.spec.js.map