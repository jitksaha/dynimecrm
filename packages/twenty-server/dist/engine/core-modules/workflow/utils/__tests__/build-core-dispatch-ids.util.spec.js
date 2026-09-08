"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildcoredispatchidsutil = require("../build-core-dispatch-ids.util");
describe('buildCoreDispatchIds', ()=>{
    it('should keep both ids when both are present', ()=>{
        expect((0, _buildcoredispatchidsutil.buildCoreDispatchIds)({
            coreWorkflowVersionId: 'core-version-1',
            workspaceWorkflowVersionId: 'workspace-version-1'
        })).toEqual({
            coreWorkflowVersionId: 'core-version-1',
            workspaceWorkflowVersionId: 'workspace-version-1'
        });
    });
    it('should collapse a half resolved pair to the legacy shape', ()=>{
        expect((0, _buildcoredispatchidsutil.buildCoreDispatchIds)({
            coreWorkflowVersionId: 'core-version-1'
        })).toEqual({
            coreWorkflowVersionId: null,
            workspaceWorkflowVersionId: null
        });
        expect((0, _buildcoredispatchidsutil.buildCoreDispatchIds)({
            workspaceWorkflowVersionId: 'workspace-version-1'
        })).toEqual({
            coreWorkflowVersionId: null,
            workspaceWorkflowVersionId: null
        });
        expect((0, _buildcoredispatchidsutil.buildCoreDispatchIds)({})).toEqual({
            coreWorkflowVersionId: null,
            workspaceWorkflowVersionId: null
        });
    });
});

//# sourceMappingURL=build-core-dispatch-ids.util.spec.js.map