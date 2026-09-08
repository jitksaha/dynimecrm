"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FrontComponentSharedDependenciesModule", {
    enumerable: true,
    get: function() {
        return FrontComponentSharedDependenciesModule;
    }
});
const _common = require("@nestjs/common");
const _frontcomponentshareddependenciescontroller = require("./front-component-shared-dependencies.controller");
const _frontcomponentshareddependenciesservice = require("./front-component-shared-dependencies.service");
const _applicationmodule = require("../application.module");
const _filestoragemodule = require("../../file-storage/file-storage.module");
const _twentyconfigmodule = require("../../twenty-config/twenty-config.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FrontComponentSharedDependenciesModule = class FrontComponentSharedDependenciesModule {
};
FrontComponentSharedDependenciesModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _applicationmodule.ApplicationModule,
            _filestoragemodule.FileStorageModule,
            _twentyconfigmodule.TwentyConfigModule
        ],
        controllers: [
            _frontcomponentshareddependenciescontroller.FrontComponentSharedDependenciesController
        ],
        providers: [
            _frontcomponentshareddependenciesservice.FrontComponentSharedDependenciesService
        ]
    })
], FrontComponentSharedDependenciesModule);

//# sourceMappingURL=front-component-shared-dependencies.module.js.map