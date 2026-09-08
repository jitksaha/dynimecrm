"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resolveworkspacememberidforuserutil = require("../resolve-workspace-member-id-for-user.util");
const buildMaps = ({ deletedAt } = {})=>({
        byId: {
            'workspace-member-1': {
                deletedAt: deletedAt ?? null
            }
        },
        idByUserId: {
            'user-1': 'workspace-member-1'
        }
    });
describe('resolveWorkspaceMemberIdForUser', ()=>{
    it('should name the member the person holds in this workspace', ()=>{
        expect((0, _resolveworkspacememberidforuserutil.resolveWorkspaceMemberIdForUser)({
            userId: 'user-1',
            flatWorkspaceMemberMaps: buildMaps()
        })).toBe('workspace-member-1');
    });
    it('should name no member for a person who has none', ()=>{
        expect((0, _resolveworkspacememberidforuserutil.resolveWorkspaceMemberIdForUser)({
            userId: 'user-2',
            flatWorkspaceMemberMaps: buildMaps()
        })).toBeNull();
    });
    it('should name no member once theirs is soft deleted', ()=>{
        expect((0, _resolveworkspacememberidforuserutil.resolveWorkspaceMemberIdForUser)({
            userId: 'user-1',
            flatWorkspaceMemberMaps: buildMaps({
                deletedAt: '2026-01-01T00:00:00.000Z'
            })
        })).toBeNull();
    });
});

//# sourceMappingURL=resolve-workspace-member-id-for-user.util.spec.js.map