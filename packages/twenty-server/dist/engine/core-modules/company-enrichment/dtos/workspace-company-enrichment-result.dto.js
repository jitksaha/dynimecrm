"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceCompanyEnrichmentResultDTO", {
    enumerable: true,
    get: function() {
        return WorkspaceCompanyEnrichmentResultDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _graphqltypejson = /*#__PURE__*/ _interop_require_default(require("graphql-type-json"));
const _workspacecompanyenrichmentoutcomeenum = require("../enums/workspace-company-enrichment-outcome.enum");
const _workspacepersonenrichmentoutcomeenum = require("../enums/workspace-person-enrichment-outcome.enum");
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
let WorkspaceCompanyEnrichmentResultDTO = class WorkspaceCompanyEnrichmentResultDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_workspacecompanyenrichmentoutcomeenum.WorkspaceCompanyEnrichmentOutcome),
    _ts_metadata("design:type", typeof _workspacecompanyenrichmentoutcomeenum.WorkspaceCompanyEnrichmentOutcome === "undefined" ? Object : _workspacecompanyenrichmentoutcomeenum.WorkspaceCompanyEnrichmentOutcome)
], WorkspaceCompanyEnrichmentResultDTO.prototype, "outcome", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphqltypejson.default, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], WorkspaceCompanyEnrichmentResultDTO.prototype, "enrichment", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_workspacepersonenrichmentoutcomeenum.WorkspacePersonEnrichmentOutcome),
    _ts_metadata("design:type", typeof _workspacepersonenrichmentoutcomeenum.WorkspacePersonEnrichmentOutcome === "undefined" ? Object : _workspacepersonenrichmentoutcomeenum.WorkspacePersonEnrichmentOutcome)
], WorkspaceCompanyEnrichmentResultDTO.prototype, "personOutcome", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphqltypejson.default, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], WorkspaceCompanyEnrichmentResultDTO.prototype, "personEnrichment", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], WorkspaceCompanyEnrichmentResultDTO.prototype, "isBookCallOnboardingStepPending", void 0);
WorkspaceCompanyEnrichmentResultDTO = _ts_decorate([
    (0, _graphql.ObjectType)('WorkspaceCompanyEnrichmentResult')
], WorkspaceCompanyEnrichmentResultDTO);

//# sourceMappingURL=workspace-company-enrichment-result.dto.js.map