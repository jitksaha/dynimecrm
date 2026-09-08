"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataSideEffectHandlerRegistryService", {
    enumerable: true,
    get: function() {
        return MetadataSideEffectHandlerRegistryService;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _utils = require("twenty-shared/utils");
const _metadatasideeffecthandlermetadatakeyconstant = require("../constants/metadata-side-effect-handler-metadata-key.constant");
const _metadatasideeffecthandlersmodule = require("../handlers/metadata-side-effect-handlers.module");
const _metadatasideeffectoperationtype = require("../types/metadata-side-effect-operation.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MetadataSideEffectHandlerRegistryService = class MetadataSideEffectHandlerRegistryService {
    onModuleInit() {
        this.discoverAndRegisterHandlers();
    }
    discoverAndRegisterHandlers() {
        const providers = this.discoveryService.getProviders({
            include: [
                _metadatasideeffecthandlersmodule.MetadataSideEffectHandlersModule
            ]
        });
        providers.forEach((wrapper)=>{
            const { instance, metatype } = wrapper;
            if (!instance || !metatype) return;
            const descriptor = Reflect.getMetadata(_metadatasideeffecthandlermetadatakeyconstant.METADATA_SIDE_EFFECT_HANDLER_METADATA_KEY, metatype);
            if (!(0, _utils.isDefined)(descriptor) || typeof instance.buildSideEffects !== 'function') {
                return;
            }
            this.registerHandler(instance);
        });
    }
    registerHandler(instance) {
        if (this.registeredSideEffectNames.has(instance.sideEffectName)) {
            throw new Error(`Duplicate metadata side-effect name "${instance.sideEffectName}". Side-effect names must be unique.`);
        }
        this.registeredSideEffectNames.add(instance.sideEffectName);
        const handlerKey = (0, _metadatasideeffectoperationtype.buildMetadataSideEffectHandlerKey)(instance.operation, instance.metadataName);
        const existingHandlers = this.handlersByKey.get(handlerKey);
        if ((0, _utils.isDefined)(existingHandlers)) {
            existingHandlers.push(instance);
            return;
        }
        this.handlersByKey.set(handlerKey, [
            instance
        ]);
        this.registeredHandlerKeys.push({
            operation: instance.operation,
            metadataName: instance.metadataName
        });
    }
    getHandlers(operation, metadataName) {
        return this.handlersByKey.get((0, _metadatasideeffectoperationtype.buildMetadataSideEffectHandlerKey)(operation, metadataName)) ?? [];
    }
    getRegisteredHandlerKeys() {
        return this.registeredHandlerKeys;
    }
    constructor(discoveryService){
        this.discoveryService = discoveryService;
        this.handlersByKey = new Map();
        this.registeredHandlerKeys = [];
        this.registeredSideEffectNames = new Set();
    }
};
MetadataSideEffectHandlerRegistryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _core.DiscoveryService === "undefined" ? Object : _core.DiscoveryService
    ])
], MetadataSideEffectHandlerRegistryService);

//# sourceMappingURL=metadata-side-effect-handler-registry.service.js.map