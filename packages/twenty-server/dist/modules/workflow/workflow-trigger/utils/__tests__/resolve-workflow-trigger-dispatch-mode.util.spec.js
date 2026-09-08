"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resolveworkflowtriggerdispatchmodeutil = require("../resolve-workflow-trigger-dispatch-mode.util");
describe('resolveWorkflowTriggerDispatchMode', ()=>{
    it('should dispatch from core when both version ids are present', ()=>{
        expect((0, _resolveworkflowtriggerdispatchmodeutil.resolveWorkflowTriggerDispatchMode)({
            coreWorkflowVersionId: 'core-version-1',
            workspaceWorkflowVersionId: 'workspace-version-1'
        })).toEqual({
            mode: 'CORE',
            coreWorkflowVersionId: 'core-version-1',
            workspaceWorkflowVersionId: 'workspace-version-1'
        });
    });
    it('should take the legacy path when both version ids are absent', ()=>{
        expect((0, _resolveworkflowtriggerdispatchmodeutil.resolveWorkflowTriggerDispatchMode)({})).toEqual({
            mode: 'LEGACY'
        });
        expect((0, _resolveworkflowtriggerdispatchmodeutil.resolveWorkflowTriggerDispatchMode)({
            coreWorkflowVersionId: null,
            workspaceWorkflowVersionId: null
        })).toEqual({
            mode: 'LEGACY'
        });
    });
    it('should report a half resolved pair instead of downgrading it', ()=>{
        expect((0, _resolveworkflowtriggerdispatchmodeutil.resolveWorkflowTriggerDispatchMode)({
            coreWorkflowVersionId: 'core-version-1'
        })).toEqual({
            mode: 'INCOMPLETE'
        });
        expect((0, _resolveworkflowtriggerdispatchmodeutil.resolveWorkflowTriggerDispatchMode)({
            workspaceWorkflowVersionId: 'workspace-version-1'
        })).toEqual({
            mode: 'INCOMPLETE'
        });
    });
});

//# sourceMappingURL=resolve-workflow-trigger-dispatch-mode.util.spec.js.map