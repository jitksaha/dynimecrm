"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelWorkspaceUsageDTO", {
    enumerable: true,
    get: function() {
        return AdminPanelWorkspaceUsageDTO;
    }
});
const _graphql = require("@nestjs/graphql");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AdminPanelWorkspaceUsageDTO = class AdminPanelWorkspaceUsageDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AdminPanelWorkspaceUsageDTO.prototype, "periodStart", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AdminPanelWorkspaceUsageDTO.prototype, "periodEnd", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    _ts_metadata("design:type", Number)
], AdminPanelWorkspaceUsageDTO.prototype, "usedCredits", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    _ts_metadata("design:type", Number)
], AdminPanelWorkspaceUsageDTO.prototype, "grantedCredits", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    _ts_metadata("design:type", Number)
], AdminPanelWorkspaceUsageDTO.prototype, "rolloverCredits", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    _ts_metadata("design:type", Number)
], AdminPanelWorkspaceUsageDTO.prototype, "totalGrantedCredits", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    _ts_metadata("design:type", Number)
], AdminPanelWorkspaceUsageDTO.prototype, "remainingCredits", void 0);
AdminPanelWorkspaceUsageDTO = _ts_decorate([
    (0, _graphql.ObjectType)('AdminPanelWorkspaceUsage')
], AdminPanelWorkspaceUsageDTO);

//# sourceMappingURL=admin-panel-workspace-usage.dto.js.map