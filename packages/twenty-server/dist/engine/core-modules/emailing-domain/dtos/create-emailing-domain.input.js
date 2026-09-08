"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateEmailingDomainInput", {
    enumerable: true,
    get: function() {
        return CreateEmailingDomainInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const DOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i;
let CreateEmailingDomainInput = class CreateEmailingDomainInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    (0, _classvalidator.MaxLength)(255),
    (0, _classvalidator.Matches)(DOMAIN_REGEX, {
        message: 'domain must be a valid domain name (e.g. mail.example.com)'
    }),
    _ts_metadata("design:type", String)
], CreateEmailingDomainInput.prototype, "domain", void 0);
CreateEmailingDomainInput = _ts_decorate([
    (0, _graphql.InputType)()
], CreateEmailingDomainInput);

//# sourceMappingURL=create-emailing-domain.input.js.map