"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildUserAuthContext", {
    enumerable: true,
    get: function() {
        return buildUserAuthContext;
    }
});
const _utils = require("twenty-shared/utils");
const buildUserAuthContext = (input)=>{
    return {
        type: 'user',
        workspace: input.workspace,
        userWorkspaceId: input.userWorkspaceId,
        user: input.user,
        workspaceMemberId: input.workspaceMemberId,
        workspaceMember: input.workspaceMember,
        ...(0, _utils.isDefined)(input.application) ? {
            application: input.application
        } : {},
        ...(0, _utils.isDefined)(input.viaApplication) ? {
            viaApplication: input.viaApplication
        } : {}
    };
};

//# sourceMappingURL=build-user-auth-context.util.js.map