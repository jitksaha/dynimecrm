"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isworkspacedeletionrequestpendingutil = require("../is-workspace-deletion-request-pending.util");
describe('isWorkspaceDeletionRequestPending', ()=>{
    it('should match only when the exact deletion request is pending', ()=>{
        const workspaceDeletedAt = new Date('2026-08-18T10:00:00.000Z');
        const workspace = {
            deletedAt: workspaceDeletedAt
        };
        expect((0, _isworkspacedeletionrequestpendingutil.isWorkspaceDeletionRequestPending)(workspace, workspaceDeletedAt.toISOString())).toBe(true);
        expect((0, _isworkspacedeletionrequestpendingutil.isWorkspaceDeletionRequestPending)(workspace, '2026-08-17T10:00:00.000Z')).toBe(false);
    });
});

//# sourceMappingURL=is-workspace-deletion-request-pending.util.spec.js.map