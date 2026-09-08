"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageThreadTargetCreateOnePreQueryHook", {
    enumerable: true,
    get: function() {
        return MessageThreadTargetCreateOnePreQueryHook;
    }
});
const _workspacequeryhookdecorator = require("../../../../../engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator");
const _applymanuallyassigneddefaultutil = require("../../../../match-participant/utils/apply-manually-assigned-default.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MessageThreadTargetCreateOnePreQueryHook = class MessageThreadTargetCreateOnePreQueryHook {
    async execute(_authContext, _objectName, payload) {
        return {
            ...payload,
            data: (0, _applymanuallyassigneddefaultutil.applyManuallyAssignedDefault)(payload.data)
        };
    }
};
MessageThreadTargetCreateOnePreQueryHook = _ts_decorate([
    (0, _workspacequeryhookdecorator.WorkspaceQueryHook)('messageThreadTarget.createOne')
], MessageThreadTargetCreateOnePreQueryHook);

//# sourceMappingURL=message-thread-target-create-one.pre-query-hook.js.map