"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildRequiredToolAuthContext", {
    enumerable: true,
    get: function() {
        return buildRequiredToolAuthContext;
    }
});
const _utils = require("twenty-shared/utils");
const _authexception = require("../../auth/auth.exception");
const _builduserauthcontextutil = require("../../auth/utils/build-user-auth-context.util");
const _fromuserentitytoflatutil = require("../../user/utils/from-user-entity-to-flat.util");
const buildRequiredToolAuthContext = async ({ context, userRepository, userWorkspaceRepository, workspaceCacheService })=>{
    if (!(0, _utils.isDefined)(context.userId) || !(0, _utils.isDefined)(context.userWorkspaceId)) {
        throw new _authexception.AuthException('userId and userWorkspaceId are required for database operations', _authexception.AuthExceptionCode.UNAUTHENTICATED);
    }
    // The identity triple arrives as separate fields, so validate that the
    // userWorkspace actually binds this user to this workspace, exactly like
    // token-based auth does, before building an auth context from it.
    const userWorkspace = await userWorkspaceRepository.findOne({
        where: {
            id: context.userWorkspaceId,
            userId: context.userId,
            workspaceId: context.workspaceId
        }
    });
    if (!(0, _utils.isDefined)(userWorkspace)) {
        throw new _authexception.AuthException('User workspace not found', _authexception.AuthExceptionCode.UNAUTHENTICATED);
    }
    const user = await userRepository.findOne({
        where: {
            id: context.userId
        }
    });
    if (!(0, _utils.isDefined)(user)) {
        throw new _authexception.AuthException('User not found', _authexception.AuthExceptionCode.UNAUTHENTICATED);
    }
    const { flatWorkspaceMemberMaps } = await workspaceCacheService.getOrRecompute(context.workspaceId, [
        'flatWorkspaceMemberMaps'
    ]);
    const workspaceMemberId = flatWorkspaceMemberMaps.idByUserId[user.id];
    const workspaceMember = (0, _utils.isDefined)(workspaceMemberId) ? flatWorkspaceMemberMaps.byId[workspaceMemberId] : undefined;
    if (!(0, _utils.isDefined)(workspaceMemberId) || !(0, _utils.isDefined)(workspaceMember)) {
        throw new _authexception.AuthException('Workspace member not found', _authexception.AuthExceptionCode.UNAUTHENTICATED);
    }
    return (0, _builduserauthcontextutil.buildUserAuthContext)({
        workspace: {
            id: context.workspaceId
        },
        userWorkspaceId: context.userWorkspaceId,
        user: (0, _fromuserentitytoflatutil.fromUserEntityToFlat)(user),
        workspaceMemberId,
        workspaceMember
    });
};

//# sourceMappingURL=build-required-tool-auth-context.util.js.map