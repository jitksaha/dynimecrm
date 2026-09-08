"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isworkspacedeletionpendingutil = require("../is-workspace-deletion-pending.util");
describe('isWorkspaceDeletionPending', ()=>{
    const workspaceDeletedAt = new Date('2026-08-18T10:00:00.000Z');
    it('should return true when the workspace is soft deleted', ()=>{
        expect((0, _isworkspacedeletionpendingutil.isWorkspaceDeletionPending)({
            deletedAt: workspaceDeletedAt
        })).toBe(true);
    });
    it('should return false when the workspace is not soft deleted', ()=>{
        expect((0, _isworkspacedeletionpendingutil.isWorkspaceDeletionPending)({
            deletedAt: undefined
        })).toBe(false);
    });
});

//# sourceMappingURL=is-workspace-deletion-pending.util.spec.js.map