"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RelatedPersonIdsModule", {
    enumerable: true,
    get: function() {
        return RelatedPersonIdsModule;
    }
});
const _common = require("@nestjs/common");
const _relatedpersonidsservice = require("./services/related-person-ids.service");
const _workspacecachemodule = require("../../workspace-cache/workspace-cache.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let RelatedPersonIdsModule = class RelatedPersonIdsModule {
};
RelatedPersonIdsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _workspacecachemodule.WorkspaceCacheModule
        ],
        providers: [
            _relatedpersonidsservice.RelatedPersonIdsService
        ],
        exports: [
            _relatedpersonidsservice.RelatedPersonIdsService
        ]
    })
], RelatedPersonIdsModule);

//# sourceMappingURL=related-person-ids.module.js.map