"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaginatedAdminChatThreadsDTO", {
    enumerable: true,
    get: function() {
        return PaginatedAdminChatThreadsDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _adminchatthreadlistitemdto = require("./admin-chat-thread-list-item.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PaginatedAdminChatThreadsDTO = class PaginatedAdminChatThreadsDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>[
            _adminchatthreadlistitemdto.AdminChatThreadListItemDTO
        ]),
    _ts_metadata("design:type", Array)
], PaginatedAdminChatThreadsDTO.prototype, "threads", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], PaginatedAdminChatThreadsDTO.prototype, "totalCount", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], PaginatedAdminChatThreadsDTO.prototype, "hasMore", void 0);
PaginatedAdminChatThreadsDTO = _ts_decorate([
    (0, _graphql.ObjectType)('PaginatedAdminChatThreads')
], PaginatedAdminChatThreadsDTO);

//# sourceMappingURL=paginated-admin-chat-threads.dto.js.map