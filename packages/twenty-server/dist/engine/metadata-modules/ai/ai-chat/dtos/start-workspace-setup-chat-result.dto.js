"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StartWorkspaceSetupChatResultDTO", {
    enumerable: true,
    get: function() {
        return StartWorkspaceSetupChatResultDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _agentchatthreaddto = require("./agent-chat-thread.dto");
const _workspacesetupchatoutcomeenum = require("../enums/workspace-setup-chat-outcome.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let StartWorkspaceSetupChatResultDTO = class StartWorkspaceSetupChatResultDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome),
    _ts_metadata("design:type", typeof _workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome === "undefined" ? Object : _workspacesetupchatoutcomeenum.WorkspaceSetupChatOutcome)
], StartWorkspaceSetupChatResultDTO.prototype, "outcome", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_agentchatthreaddto.AgentChatThreadDTO, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], StartWorkspaceSetupChatResultDTO.prototype, "thread", void 0);
StartWorkspaceSetupChatResultDTO = _ts_decorate([
    (0, _graphql.ObjectType)('StartWorkspaceSetupChatResult')
], StartWorkspaceSetupChatResultDTO);

//# sourceMappingURL=start-workspace-setup-chat-result.dto.js.map