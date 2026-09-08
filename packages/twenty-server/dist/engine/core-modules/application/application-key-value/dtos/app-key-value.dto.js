"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppKeyValueDto", {
    enumerable: true,
    get: function() {
        return AppKeyValueDto;
    }
});
const _graphql = require("@nestjs/graphql");
const _graphqltypejson = /*#__PURE__*/ _interop_require_default(require("graphql-type-json"));
const _appkeyvaluescopeenum = require("../enums/app-key-value-scope.enum");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AppKeyValueDto = class AppKeyValueDto {
};
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], AppKeyValueDto.prototype, "key", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphqltypejson.default, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AppKeyValueDto.prototype, "value", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_appkeyvaluescopeenum.AppKeyValueScope),
    _ts_metadata("design:type", typeof _appkeyvaluescopeenum.AppKeyValueScope === "undefined" ? Object : _appkeyvaluescopeenum.AppKeyValueScope)
], AppKeyValueDto.prototype, "scope", void 0);
AppKeyValueDto = _ts_decorate([
    (0, _graphql.ObjectType)('AppKeyValue')
], AppKeyValueDto);

//# sourceMappingURL=app-key-value.dto.js.map