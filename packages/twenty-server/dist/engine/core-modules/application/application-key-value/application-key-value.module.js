"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationKeyValueModule", {
    enumerable: true,
    get: function() {
        return ApplicationKeyValueModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _applicationkeyvalueresolver = require("./application-key-value.resolver");
const _applicationkeyvalueservice = require("./services/application-key-value.service");
const _applicationregistrationentity = require("../application-registration/application-registration.entity");
const _applicationentity = require("../application.entity");
const _keyvaluepairentity = require("../../key-value-pair/key-value-pair.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ApplicationKeyValueModule = class ApplicationKeyValueModule {
};
ApplicationKeyValueModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _keyvaluepairentity.KeyValuePairEntity,
                _applicationentity.ApplicationEntity,
                _applicationregistrationentity.ApplicationRegistrationEntity
            ])
        ],
        providers: [
            _applicationkeyvalueservice.ApplicationKeyValueService,
            _applicationkeyvalueresolver.ApplicationKeyValueResolver
        ],
        exports: [
            _applicationkeyvalueservice.ApplicationKeyValueService
        ]
    })
], ApplicationKeyValueModule);

//# sourceMappingURL=application-key-value.module.js.map