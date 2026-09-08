"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CampaignAudiencePreviewDTO", {
    enumerable: true,
    get: function() {
        return CampaignAudiencePreviewDTO;
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
let CampaignAudiencePreviewDTO = class CampaignAudiencePreviewDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], CampaignAudiencePreviewDTO.prototype, "totalMembers", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], CampaignAudiencePreviewDTO.prototype, "withoutEmail", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], CampaignAudiencePreviewDTO.prototype, "duplicateEmails", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], CampaignAudiencePreviewDTO.prototype, "overCap", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], CampaignAudiencePreviewDTO.prototype, "globallyUnsubscribed", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], CampaignAudiencePreviewDTO.prototype, "topicUnsubscribed", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], CampaignAudiencePreviewDTO.prototype, "sendable", void 0);
CampaignAudiencePreviewDTO = _ts_decorate([
    (0, _graphql.ObjectType)()
], CampaignAudiencePreviewDTO);

//# sourceMappingURL=campaign-audience-preview.dto.js.map