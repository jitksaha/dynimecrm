"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _applicationtranslationcacheservice = require("../application-translation-cache.service");
const _applicationtranslationsyncservice = require("../application-translation-sync.service");
const _applicationtranslationentity = require("../application-translation.entity");
const APPLICATION_REGISTRATION_ID = '20202020-0000-0000-0000-000000000001';
describe('ApplicationTranslationSyncService', ()=>{
    let service;
    const repository = {
        find: jest.fn(),
        update: jest.fn(),
        insert: jest.fn(),
        softDelete: jest.fn()
    };
    const cacheService = {
        invalidate: jest.fn()
    };
    beforeEach(async ()=>{
        jest.clearAllMocks();
        repository.find.mockResolvedValue([]);
        const module = await _testing.Test.createTestingModule({
            providers: [
                _applicationtranslationsyncservice.ApplicationTranslationSyncService,
                {
                    provide: (0, _typeorm.getRepositoryToken)(_applicationtranslationentity.ApplicationTranslationEntity),
                    useValue: repository
                },
                {
                    provide: _applicationtranslationcacheservice.ApplicationTranslationCacheService,
                    useValue: cacheService
                }
            ]
        }).compile();
        service = module.get(_applicationtranslationsyncservice.ApplicationTranslationSyncService);
    });
    it('leaves stored translations alone when the manifest carries none', async ()=>{
        await service.syncFromManifest({
            applicationRegistrationId: APPLICATION_REGISTRATION_ID,
            translations: undefined
        });
        expect(repository.find).toHaveBeenCalledTimes(0);
        expect(repository.update).toHaveBeenCalledTimes(0);
        expect(repository.insert).toHaveBeenCalledTimes(0);
        expect(repository.softDelete).toHaveBeenCalledTimes(0);
        expect(cacheService.invalidate).toHaveBeenCalledTimes(0);
    });
    it('applies the manifest when it declares translations', async ()=>{
        repository.find.mockResolvedValue([
            {
                id: 'row-de',
                locale: 'de-DE',
                deletedAt: null
            }
        ]);
        await service.syncFromManifest({
            applicationRegistrationId: APPLICATION_REGISTRATION_ID,
            translations: {
                'fr-FR': {
                    abc123: 'Entreprise'
                }
            }
        });
        expect(repository.insert).toHaveBeenCalledTimes(1);
        expect(repository.insert).toHaveBeenCalledWith({
            applicationRegistrationId: APPLICATION_REGISTRATION_ID,
            locale: 'fr-FR',
            messages: {
                abc123: 'Entreprise'
            }
        });
        expect(repository.softDelete).toHaveBeenCalledTimes(1);
        expect(repository.softDelete).toHaveBeenCalledWith([
            'row-de'
        ]);
        expect(cacheService.invalidate).toHaveBeenCalledTimes(1);
    });
});

//# sourceMappingURL=application-translation-sync.service.spec.js.map