"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "withResolvedToolAuthContext", {
    enumerable: true,
    get: function() {
        return withResolvedToolAuthContext;
    }
});
const _utils = require("twenty-shared/utils");
const _workspaceauthcontextstorage = require("../../auth/storage/workspace-auth-context.storage");
const _buildrequiredtoolauthcontextutil = require("./build-required-tool-auth-context.util");
const withResolvedToolAuthContext = async ({ context, userRepository, userWorkspaceRepository, workspaceCacheService }, dispatch)=>{
    const authContext = context.authContext ?? ((0, _utils.isDefined)(context.userId) && (0, _utils.isDefined)(context.userWorkspaceId) ? await (0, _buildrequiredtoolauthcontextutil.buildRequiredToolAuthContext)({
        context,
        userRepository,
        userWorkspaceRepository,
        workspaceCacheService
    }) : undefined);
    if (!(0, _utils.isDefined)(authContext)) {
        return dispatch(context);
    }
    return await (0, _workspaceauthcontextstorage.withWorkspaceAuthContext)(authContext, ()=>dispatch({
            ...context,
            authContext
        }));
};

//# sourceMappingURL=with-resolved-tool-auth-context.util.js.map