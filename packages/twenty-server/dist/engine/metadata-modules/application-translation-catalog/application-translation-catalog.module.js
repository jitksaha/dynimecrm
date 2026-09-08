"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationTranslationCatalogModule", {
    enumerable: true,
    get: function() {
        return ApplicationTranslationCatalogModule;
    }
});
const _common = require("@nestjs/common");
const _applicationtranslationmodule = require("../../core-modules/application/application-translation/application-translation.module");
const _applicationtranslationcatalogservice = require("./services/application-translation-catalog.service");
const _workspacemanyorallflatentitymapscachemodule = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ApplicationTranslationCatalogModule = class ApplicationTranslationCatalogModule {
};
ApplicationTranslationCatalogModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationtranslationmodule.ApplicationTranslationModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule
        ],
        providers: [
            _applicationtranslationcatalogservice.ApplicationTranslationCatalogService
        ],
        exports: [
            _applicationtranslationcatalogservice.ApplicationTranslationCatalogService
        ]
    })
], ApplicationTranslationCatalogModule);

//# sourceMappingURL=application-translation-catalog.module.js.map