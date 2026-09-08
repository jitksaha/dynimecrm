// Ordered privacy levels controlling how a workspace surfaces in the
// root-domain (app.twenty.com) sign-in picker. Each level hides strictly more
// than the previous one:
// - PUBLIC: discoverable by anyone whose email domain matches an approved access domain
// - MEMBERS_AND_INVITEES: hidden from email-domain discovery, still shown to members and invited users
// - HIDDEN: never listed in the picker; members and invited users sign in from the workspace URL directly
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceDiscoverability", {
    enumerable: true,
    get: function() {
        return WorkspaceDiscoverability;
    }
});
var WorkspaceDiscoverability = /*#__PURE__*/ function(WorkspaceDiscoverability) {
    WorkspaceDiscoverability["PUBLIC"] = "PUBLIC";
    WorkspaceDiscoverability["MEMBERS_AND_INVITEES"] = "MEMBERS_AND_INVITEES";
    WorkspaceDiscoverability["HIDDEN"] = "HIDDEN";
    return WorkspaceDiscoverability;
}({});

//# sourceMappingURL=workspace-discoverability.type.js.map