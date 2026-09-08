"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DpaModule", {
    enumerable: true,
    get: function() {
        return DpaModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _applicationmodule = require("../application/application.module");
const _dparesolver = require("./dpa.resolver");
const _dpaagreemententity = require("./entities/dpa-agreement.entity");
const _dparegionservice = require("./services/dpa-region.service");
const _dpaservice = require("./services/dpa.service");
const _fileurlmodule = require("../file/file-url/file-url.module");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DpaModule = class DpaModule {
};
DpaModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _dpaagreemententity.DpaAgreementEntity
            ]),
            _fileurlmodule.FileUrlModule,
            _applicationmodule.ApplicationModule,
            _permissionsmodule.PermissionsModule
        ],
        providers: [
            _dpaservice.DpaService,
            _dparegionservice.DpaRegionService,
            _dparesolver.DpaResolver
        ],
        exports: [
            _dpaservice.DpaService,
            _dparegionservice.DpaRegionService
        ]
    })
], DpaModule);

//# sourceMappingURL=dpa.module.js.map