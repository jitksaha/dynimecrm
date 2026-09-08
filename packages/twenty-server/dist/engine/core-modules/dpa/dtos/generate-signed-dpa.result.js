"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GenerateSignedDpaResult", {
    enumerable: true,
    get: function() {
        return GenerateSignedDpaResult;
    }
});
const _graphql = require("@nestjs/graphql");
const _dpaagreemententity = require("../entities/dpa-agreement.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let GenerateSignedDpaResult = class GenerateSignedDpaResult {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_dpaagreemententity.DpaAgreementEntity),
    _ts_metadata("design:type", typeof _dpaagreemententity.DpaAgreementEntity === "undefined" ? Object : _dpaagreemententity.DpaAgreementEntity)
], GenerateSignedDpaResult.prototype, "agreement", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], GenerateSignedDpaResult.prototype, "downloadUrl", void 0);
GenerateSignedDpaResult = _ts_decorate([
    (0, _graphql.ObjectType)('GenerateSignedDpaResult')
], GenerateSignedDpaResult);

//# sourceMappingURL=generate-signed-dpa.result.js.map