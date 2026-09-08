"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppConnectionObjectDto", {
    enumerable: true,
    get: function() {
        return AppConnectionObjectDto;
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
let AppConnectionObjectDto = class AppConnectionObjectDto {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.ID),
    _ts_metadata("design:type", String)
], AppConnectionObjectDto.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], AppConnectionObjectDto.prototype, "providerName", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], AppConnectionObjectDto.prototype, "name", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], AppConnectionObjectDto.prototype, "handle", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], AppConnectionObjectDto.prototype, "visibility", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], AppConnectionObjectDto.prototype, "userWorkspaceId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AppConnectionObjectDto.prototype, "workspaceMemberId", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], AppConnectionObjectDto.prototype, "accessToken", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            String
        ]),
    _ts_metadata("design:type", Array)
], AppConnectionObjectDto.prototype, "scopes", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AppConnectionObjectDto.prototype, "authFailedAt", void 0);
AppConnectionObjectDto = _ts_decorate([
    (0, _graphql.ObjectType)('AppConnection')
], AppConnectionObjectDto);

//# sourceMappingURL=app-connection.object.js.map