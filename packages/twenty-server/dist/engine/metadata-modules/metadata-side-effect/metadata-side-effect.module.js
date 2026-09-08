"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataSideEffectModule", {
    enumerable: true,
    get: function() {
        return MetadataSideEffectModule;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _metadatasideeffecthandlersmodule = require("./handlers/metadata-side-effect-handlers.module");
const _metadatasideeffecthandlerregistryservice = require("./registry/metadata-side-effect-handler-registry.service");
const _metadatasideeffectengineservice = require("./services/metadata-side-effect-engine.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MetadataSideEffectModule = class MetadataSideEffectModule {
};
MetadataSideEffectModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _core.DiscoveryModule,
            _metadatasideeffecthandlersmodule.MetadataSideEffectHandlersModule
        ],
        providers: [
            _metadatasideeffecthandlerregistryservice.MetadataSideEffectHandlerRegistryService,
            _metadatasideeffectengineservice.MetadataSideEffectEngineService
        ],
        exports: [
            _metadatasideeffectengineservice.MetadataSideEffectEngineService
        ]
    })
], MetadataSideEffectModule);

//# sourceMappingURL=metadata-side-effect.module.js.map