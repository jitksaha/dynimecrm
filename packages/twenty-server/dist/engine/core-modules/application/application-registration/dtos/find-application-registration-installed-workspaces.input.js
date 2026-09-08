"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FindApplicationRegistrationInstalledWorkspacesInput", {
    enumerable: true,
    get: function() {
        return FindApplicationRegistrationInstalledWorkspacesInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
const _installedworkspacespaginationconstant = require("../constants/installed-workspaces-pagination.constant");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FindApplicationRegistrationInstalledWorkspacesInput = class FindApplicationRegistrationInstalledWorkspacesInput {
};
_ts_decorate([
    (0, _graphql.Field)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FindApplicationRegistrationInstalledWorkspacesInput.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int, {
        defaultValue: _installedworkspacespaginationconstant.INSTALLED_WORKSPACES_DEFAULT_LIMIT
    }),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(1),
    (0, _classvalidator.Max)(100),
    _ts_metadata("design:type", Number)
], FindApplicationRegistrationInstalledWorkspacesInput.prototype, "limit", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int, {
        defaultValue: _installedworkspacespaginationconstant.INSTALLED_WORKSPACES_DEFAULT_OFFSET
    }),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], FindApplicationRegistrationInstalledWorkspacesInput.prototype, "offset", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MaxLength)(256),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], FindApplicationRegistrationInstalledWorkspacesInput.prototype, "searchTerm", void 0);
FindApplicationRegistrationInstalledWorkspacesInput = _ts_decorate([
    (0, _graphql.InputType)()
], FindApplicationRegistrationInstalledWorkspacesInput);

//# sourceMappingURL=find-application-registration-installed-workspaces.input.js.map