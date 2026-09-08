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
    get APPLICATION_KILL_SWITCH_LOCAL_CACHE_TTL_MS () {
        return APPLICATION_KILL_SWITCH_LOCAL_CACHE_TTL_MS;
    },
    get ApplicationStopService () {
        return ApplicationStopService;
    }
});
const _common = require("@nestjs/common");
const _cachestoragedecorator = require("../../cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../cache-storage/types/cache-storage-namespace.enum");
const _promisememoizerstorage = require("../../../twenty-orm/storage/promise-memoizer.storage");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const APPLICATION_KILL_SWITCH_LOCAL_CACHE_TTL_MS = 60_000;
let ApplicationStopService = class ApplicationStopService {
    async stop(applicationUniversalIdentifier) {
        await this.cacheStorageService.set(this.getKillSwitchKey(applicationUniversalIdentifier), 'stopped');
    }
    async remove(applicationUniversalIdentifier) {
        await this.cacheStorageService.del(this.getKillSwitchKey(applicationUniversalIdentifier));
    }
    async isApplicationStopped(applicationUniversalIdentifier) {
        const cacheEntry = await this.memoizer.memoizePromiseAndExecute(`application-${applicationUniversalIdentifier}`, ()=>this.readKillSwitch(applicationUniversalIdentifier));
        return cacheEntry?.isStopped ?? false;
    }
    async readKillSwitch(applicationUniversalIdentifier) {
        try {
            const isStopped = await this.cacheStorageService.get(this.getKillSwitchKey(applicationUniversalIdentifier)) !== undefined;
            return {
                isStopped
            };
        } catch  {
            return {
                isStopped: false
            };
        }
    }
    getKillSwitchKey(applicationUniversalIdentifier) {
        return `kill-switch:${applicationUniversalIdentifier}`;
    }
    constructor(cacheStorageService){
        this.cacheStorageService = cacheStorageService;
        this.memoizer = new _promisememoizerstorage.PromiseMemoizer(APPLICATION_KILL_SWITCH_LOCAL_CACHE_TTL_MS);
    }
};
ApplicationStopService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.ModuleApplications)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService
    ])
], ApplicationStopService);

//# sourceMappingURL=application-stop.service.js.map