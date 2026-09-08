"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RunAgentMessageInputDTO", {
    enumerable: true,
    get: function() {
        return RunAgentMessageInputDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
const _runagentmessageroleenum = require("../enums/run-agent-message-role.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RunAgentMessageInputDTO = class RunAgentMessageInputDTO {
};
_ts_decorate([
    (0, _classvalidator.IsEnum)(_runagentmessageroleenum.RunAgentMessageRole),
    (0, _graphql.Field)(()=>_runagentmessageroleenum.RunAgentMessageRole),
    _ts_metadata("design:type", typeof _runagentmessageroleenum.RunAgentMessageRole === "undefined" ? Object : _runagentmessageroleenum.RunAgentMessageRole)
], RunAgentMessageInputDTO.prototype, "role", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], RunAgentMessageInputDTO.prototype, "content", void 0);
RunAgentMessageInputDTO = _ts_decorate([
    (0, _graphql.InputType)('RunAgentMessageInput')
], RunAgentMessageInputDTO);

//# sourceMappingURL=run-agent-message.input.js.map