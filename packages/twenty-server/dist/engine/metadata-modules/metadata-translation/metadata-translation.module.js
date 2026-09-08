"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataTranslationModule", {
    enumerable: true,
    get: function() {
        return MetadataTranslationModule;
    }
});
const _common = require("@nestjs/common");
const _applicationtranslationcatalogmodule = require("../application-translation-catalog/application-translation-catalog.module");
const _workspacemanyorallflatentitymapscachemodule = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _metadatatranslationresolver = require("./metadata-translation.resolver");
const _metadatatranslationservice = require("./services/metadata-translation.service");
const _permissionsmodule = require("../permissions/permissions.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MetadataTranslationModule = class MetadataTranslationModule {
};
MetadataTranslationModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationtranslationcatalogmodule.ApplicationTranslationCatalogModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _permissionsmodule.PermissionsModule
        ],
        providers: [
            _metadatatranslationservice.MetadataTranslationService,
            _metadatatranslationresolver.MetadataTranslationResolver
        ],
        exports: [
            _metadatatranslationservice.MetadataTranslationService
        ]
    })
], MetadataTranslationModule);

//# sourceMappingURL=metadata-translation.module.js.map