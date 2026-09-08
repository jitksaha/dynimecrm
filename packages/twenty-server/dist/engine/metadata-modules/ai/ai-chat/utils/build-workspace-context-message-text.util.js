"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildWorkspaceContextMessageText", {
    enumerable: true,
    get: function() {
        return buildWorkspaceContextMessageText;
    }
});
const _guards = require("@sniptt/guards");
const _workspacecontextdisplaynamemaxlengthconstant = require("../constants/workspace-context-display-name-max-length.constant");
const _workspacecontextuseremailmaxlengthconstant = require("../constants/workspace-context-user-email-max-length.constant");
const _sanitizepromptcontextlineutil = require("../../../../../utils/sanitize-prompt-context-line.util");
const buildWorkspaceContextMessageText = ({ workspaceDisplayName, workspaceSubdomain, userEmail })=>{
    const sanitizedWorkspaceDisplayName = (0, _sanitizepromptcontextlineutil.sanitizePromptContextLine)({
        value: workspaceDisplayName,
        maxLength: _workspacecontextdisplaynamemaxlengthconstant.WORKSPACE_CONTEXT_DISPLAY_NAME_MAX_LENGTH
    });
    const workspaceNameSegment = (0, _guards.isNonEmptyString)(sanitizedWorkspaceDisplayName) ? `named "${sanitizedWorkspaceDisplayName}"` : 'not named yet';
    const sanitizedUserEmail = (0, _sanitizepromptcontextlineutil.sanitizePromptContextLine)({
        value: userEmail,
        maxLength: _workspacecontextuseremailmaxlengthconstant.WORKSPACE_CONTEXT_USER_EMAIL_MAX_LENGTH
    });
    const adminSegment = (0, _guards.isNonEmptyString)(sanitizedUserEmail) ? `The admin setting it up signed up with ${sanitizedUserEmail}.` : 'The admin setting it up has no email on file.';
    return `This workspace is ${workspaceNameSegment} (subdomain: ${workspaceSubdomain}). ${adminSegment}`;
};

//# sourceMappingURL=build-workspace-context-message-text.util.js.map